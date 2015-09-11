(function() {
    var canvas, context, canvaso, contexto, canvasF, contextF;
    var tool;
    var tool_default = 'pencil';
    
    function checkFile(file) {
        if (!file) {
            sweetAlert("Prázdno!", "Schránka neobsahuje žádný obrázek.", "error");
            return false;
        }
            
        if (file.size > 10485760) {
            sweetAlert("Moc velké", "Velikost obrázku přesahuje povolenou velikost 10 MB!", "error");
            return false;
        }
        
        var types = ["image/png", "image/jpeg"];        
        if (types.indexOf(file.type) === -1) {
            sweetAlert("Nepodporováno!", "Vložený soubor není podporován.", "error");
            return false;
        }        
        return true;
    }
    
    function initEdit () {
        console.log("init");
        
        canvaso = document.getElementById('imageView');
        contexto = canvaso.getContext('2d');

        var container = canvaso.parentNode;
        canvas = document.createElement('canvas');

        
        canvasF = document.createElement('canvas');
        console.log(canvasF);
        canvas.id = 'imageTemp';
        canvas.width = canvaso.width;
        canvas.height = canvaso.height;
        container.appendChild(canvas);        

        context = canvas.getContext('2d');        
        
        canvasF.id = 'imageFull';
        canvasF.width = canvaso.width;
        canvasF.height = canvaso.height;
        contextF = canvasF.getContext('2d');

        var tool_select = document.getElementById('dtool');
        if (!tool_select) {
            alert('Error: failed to get the dtool element!');
            return;
        }
        tool_select.addEventListener('change', ev_tool_change, false);

        if (tools[tool_default]) {
            tool = new tools[tool_default]();
            tool_select.value = tool_default;
        }
        
        context.imageSmoothingEnabled = true;
        
        canvas.addEventListener('mousedown', ev_canvas, false);
        canvas.addEventListener('mousemove', ev_canvas, false);
        canvas.addEventListener('mouseup', ev_canvas, false);
    }
    
    function ev_canvas(ev) {
        if (ev.layerX || ev.layerX == 0) { // Firefox
            ev._x = ev.layerX;
            ev._y = ev.layerY;
        } else if (ev.offsetX || ev.offsetX == 0) { // Opera
            ev._x = ev.offsetX;
            ev._y = ev.offsetY;
        }

        var func = tool[ev.type];
        if (func) {
            func(ev);
        }
    }
    
    function ev_tool_change (ev) {
        if (tools[this.value]) {
            tool = new tools[this.value]();
        }
    }
    
    function img_update() {
        
        contexto.drawImage(canvas, 0, 0);
        contextF.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvasF.width, canvasF.height);
        context.clearRect(0, 0, canvas.width, canvas.height);
    }    

    var tools = {};


    tools.pencil = function () {
        var tool = this;
        this.started = false;
        
        context.lineWidth = 1;
        context.strokeStyle = "red";

        this.mousedown = function (ev) {
            context.beginPath();
            context.moveTo(ev._x, ev._y);
            tool.started = true;
        };

        this.mousemove = function (ev) {
            if (tool.started) {
                context.lineTo(ev._x, ev._y);
                context.stroke();
            }
        };

        this.mouseup = function (ev) {
            if (tool.started) {
                tool.mousemove(ev);
                tool.started = false;
                img_update();
            }
        };
    };
    
    tools.highlighter = function () {
        var tool = this;
        this.started = false;
        
        context.lineWidth = 15;
        contexto.strokeStyle = "rgba(255,197,82,0.05)";

        this.mousedown = function (ev) {
            context.strokeStyle = "rgba(255,197,82,0.05)";
            context.beginPath();
             context.strokeStyle = "rgba(255,197,82,0.05)";         
            context.moveTo(ev._x, ev._y);
            tool.started = true;
        };

        this.mousemove = function (ev) {
            if (tool.started) {
                context.strokeStyle = "rgba(255,197,82,0.05)";
                context.lineTo(ev._x, ev._y);
                context.stroke();
                 context.strokeStyle = "rgba(255,197,82,0.05)";
            }
        };

        this.mouseup = function (ev) {
            if (tool.started) {
                context.strokeStyle = "rgba(255,197,82,0.05)";
                tool.mousemove(ev);
                tool.started = false;
                img_update();
            }
        };
        
    };        

    tools.crop = function () {
        var tool = this;
        this.started = false;

        this.mousedown = function (ev) {
            tool.started = true;
            tool.x0 = ev._x;
            tool.y0 = ev._y;
        };

        this.mousemove = function (ev) {
            if (!tool.started) {
                return;
            }

            var x = Math.min(ev._x, tool.x0),
                y = Math.min(ev._y, tool.y0),
                w = Math.abs(ev._x - tool.x0),
                h = Math.abs(ev._y - tool.y0);

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (!w || !h) {
                return;
            }

            context.strokeRect(x, y, w, h);
        };

        this.mouseup = function (ev) {
            if (tool.started) {
                tool.mousemove(ev);
                tool.started = false;
                var x = Math.min(ev._x, tool.x0),
                    y = Math.min(ev._y, tool.y0),
                    w = Math.abs(ev._x - tool.x0),
                    h = Math.abs(ev._y - tool.y0);
            
                cropImage(x, y, w, h);                
                context.clearRect(0, 0, canvas.width, canvas.height);              
            }
        };
    };
    
    function cropImage(x, y, w, h)
    {                
        var scaleX = canvasF.width / canvas.width;
        points = [ x * scaleX, y * scaleX, w * scaleX, h * scaleX ];
        resize(canvasF, canvasF, points, points[2], points[3]);

        dim = calculateDimensions(points[2], points[3]);
        w = dim[0];
        h = dim[1];
        var scaleX = canvasF.width / w;
        points = [ 0, 0, w * scaleX, h * scaleX ];
        
        resize(canvaso, canvasF, points, w, h);        

        $("#edit-container").css('width', w);
        $("#edit-container").css('height', h);
        canvas.width = w;
        canvas.height = h;
    }
    
    function resize(toCanvas, fromCanvas, points, newW, newH){
        var temp_cnvs = document.createElement('canvas');
        var temp_cntx = temp_cnvs.getContext('2d');
        var toContext = toCanvas.getContext('2d');

        temp_cnvs.width = newW;
        temp_cnvs.height = newH;
        temp_cntx.drawImage(fromCanvas, points[0], points[1], points[2], points[3], 0, 0, newW, newH);

        toCanvas.width = newW; 
        toCanvas.height = newH;
        toContext.drawImage(temp_cnvs, 0, 0)
    }

    tools.rect = function () {
        var tool = this;
        this.started = false;

        this.mousedown = function (ev) {
            tool.started = true;
            tool.x0 = ev._x;
            tool.y0 = ev._y;
        };

        this.mousemove = function (ev) {
            if (!tool.started) {
                return;
            }

            var x = Math.min(ev._x, tool.x0),
                    y = Math.min(ev._y, tool.y0),
                    w = Math.abs(ev._x - tool.x0),
                    h = Math.abs(ev._y - tool.y0);

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (!w || !h) {
                return;
            }
            context.strokeRect(x, y, w, h);
        };

        this.mouseup = function (ev) {
            if (tool.started) {
                tool.mousemove(ev);
                tool.started = false;
                img_update();
            }
        };
    };

    tools.line = function () {
        var tool = this;
        this.started = false;

        this.mousedown = function (ev) {
            tool.started = true;
            tool.x0 = ev._x;
            tool.y0 = ev._y;
        };

        this.mousemove = function (ev) {
            if (!tool.started) {
                return;
            }
            
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.beginPath();
            context.moveTo(tool.x0, tool.y0);
            context.lineTo(ev._x, ev._y);
            context.stroke();
            context.closePath();
        };

        this.mouseup = function (ev) {
            if (tool.started) {
                tool.mousemove(ev);
                tool.started = false;
                
                img_update();
            }
        };
    };

    function calculateDimensions(imgWidth, imgHeight) {
        var wWidth = $(window).width() * 0.8;
        var wHeight = $(window).height() * 0.8;
        console.log("init width: " + wWidth + " init height: " + wHeight)

        if (wWidth > imgWidth)
        {
            if (wHeight > imgHeight)
            {
                w = imgWidth;
                h = imgHeight;
            }
            else
            {
                w = wHeight / imgHeight * imgWidth;
                h = wHeight;
            }
        }
        else
        {
            if (wHeight > imgHeight)
            {
                w = wWidth;
                h = wWidth / imgWidth * imgHeight;
            }
            else
            {
                w = wWidth;
                h = wWidth / imgWidth * imgHeight;

                if (h > wHeight)
                {
                    h = wHeight;
                    w = wHeight / imgHeight * imgWidth;
                }
            }
        }
        
        return [w, h];
    }
    
    function ShowImage(file) {
        $("#upload-area").attr("id", "edit-container");
        $("#edit-container").html('<canvas id="imageView" width="1000"  height="700"><p>hovnoooooooooooooooooooooo</p>');
        
        var reader = new FileReader();
        reader.onload = function(e) {
            var canvas = document.getElementById('imageView');            
            context = canvas.getContext('2d');

            var img = new Image();
            
            img.onload = function () {                            
                var w, h;
                dim = calculateDimensions(img.width, img.height);
                w = dim[0];
                h = dim[1];
                
                console.log("width: " + w + " height: " + h);
                
                canvas.width = w;
                canvas.height = h;
                context.drawImage(img, 0, 0, img.width, img.height, // source rectangle
                        0, 0, w, h);

                $("#main").css("width", 'auto');
                $("#edit-container").css('width', canvas.width);
                $("#edit-container").css('height', canvas.height);
                $("#progress-container").css('width', canvas.width);

                initEdit();
                
                canvasF.width = img.width;
                canvasF.height = img.height;
                contextF.drawImage(img, 0, 0);                
                
                
                $("#edit-container").after("<a href=\"#\" id=\"save-btn\">Uložit</a>");
            }
            
            img.src = e.target.result;
        }  
        reader.readAsDataURL(file);
    }
    
    function sendFile(file) {
        var xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", function(e) {
            if (e.lengthComputable) {
                var percentComplete = e.loaded / e.total * 100;
                console.log(percentComplete);
                $("#progress progress").attr('value', percentComplete);
                $("#progress-bar").width(percentComplete + '%');
            }
        }, false);

        xhr.onreadystatechange = function(e) {
            if (xhr.readyState === 4) {
                console.log(xhr.status == 200 ? "success" : "failure");
                var response = $.parseJSON(xhr.responseText);
                if (response.state == "success") {
                    $("#result").html('<input id="result-input" type="text" value="' + window.location.href + response.code + '" autofocus="autofocus">').hide().fadeIn( "fast" );
                    $("#progress-container").fadeOut();
                    ShowImage(file);
                    token = response.token;
                }
            }
        };

        xhr.open("POST", uploadLink, true);
        xhr.setRequestHeader("X_FILENAME", file.name);

        $("#progress-container").html('<div id="progress-div"><div id="progress-bar"></div></div>');

        xhr.send(file);
    }
    
    var token;
    
    function UploadFile(file) {
        
        if (checkFile(file)) {
            console.log("check file");
            var reader = new FileReader();
            reader.onload = function(e) {
                var img = new Image();
                img.src = e.target.result;
                var size = img.width * img.width * 3 * 1.6;

                if (size > 120000000) {
                    console.log("moc px");
                } else {
                    sendFile(file);
                }
            }            
            reader.readAsDataURL(file);
        }
    }    
    
    function UpdateImage() {
        $.nette.ajax({
            type: 'POST',
            url: updateLink,
            data: {
                token: token,
                image: canvasF.toDataURL()
            }
        }).done(function (response) {
            if (response.status == "success") {
                swal({
                    title: "Aktualizováno!",
                    text: "Úpravy byly úspěšně uloženy.",
                    type: "success"
                });
            } else {
                console.log(response);
                swal({
                    title: "Chyba!",
                    text: response.message,
                    type: "error"
                });
            }
        });
    }
    
    function FileDragHover(e) {
        e.stopPropagation();
        e.preventDefault();        
        (e.type === "dragover" ? $(e.target).addClass("hover") : $(e.target).removeClass("hover"));
    }

    function FileSelectHandler(e) {
        FileDragHover(e);

        var files = e.originalEvent.dataTransfer.files;
        UploadFile(files[0]);
    }
    
    function PasteEvent(e) {
        var item = e.originalEvent.clipboardData.items[0];
        UploadFile(item.getAsFile());
    }
    
    $(document).on('click', '#save-btn', function(e) {
        e.preventDefault();
        UpdateImage();
    });

    $(document).ready(function() {
        $(window).on("paste", PasteEvent);
        $("#upload-area").on("dragover", FileDragHover);
        $("#upload-area").on("dragleave", FileDragHover);
        $("#upload-area").on("drop", FileSelectHandler);        
    });
})();
