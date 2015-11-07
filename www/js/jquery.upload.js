(function Upload() {
    var canvas, context, canvaso, contexto, canvasF, contextF;
    var tool;
    var code;
    var token;
    var box;
     var color;
    
    function checkFile(file) {
        if (!file) {
            sweetAlert("Prázdno!", "Schránka neobsahuje žádný obrázek.", "error");
            return false;
        }
            
        if (file.size > 10485760) {
            sweetAlert("Moc velké", "Velikost obrázku přesahuje povolenou velikost 10 MB!", "error");
            return false;
        }
        console.log(file.type);
        var types = ["image/png", "image/jpeg"];        
        if (types.indexOf(file.type) === -1) {
            sweetAlert("Nepodporováno!", "Vložený soubor není podporován.", "error");
            return false;
        }        
        return true;
    }
    
    function initEdit () {        
        canvaso = document.getElementById('imageView');
        canvaso.imageSmoothingEnabled = false;
        contexto = canvaso.getContext('2d');

        var container = canvaso.parentNode;
        canvas = document.createElement('canvas');
        canvas.imageSmoothingEnabled = false;
        
        canvasF = document.createElement('canvas');
        canvasF.imageSmoothingEnabled = false;
        canvas.id = 'imageTemp';
        canvas.width = canvaso.width;
        canvas.height = canvaso.height;
        container.appendChild(canvas);        

        context = canvas.getContext('2d');        
        
        canvasF.id = 'imageFull';
        canvasF.width = canvaso.width;
        canvasF.height = canvaso.height;
        contextF = canvasF.getContext('2d');
        
        canvas.addEventListener('mousedown', ev_canvas, false);
        canvas.addEventListener('mousemove', ev_canvas, false);
        canvas.addEventListener('mouseup', ev_canvas, false);
        
        $('.toolbox').show();
        $('.upload-container').addClass('uploaded');
    }
    
    function ev_canvas(ev) {
        if (tool) {
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
    }
    
    var tools = {};    
    
    function img_update() {        
        contexto.drawImage(canvas, 0, 0);
        contextF.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvasF.width, canvasF.height);
        context.clearRect(0, 0, canvas.width, canvas.height);
    }    
    
    tools.pencil = function () {
        var tool = this;
        this.started = false;
        
        context.lineWidth = 1;

        this.mousedown = function (ev) {
            context.beginPath();
            context.moveTo(ev._x, ev._y);
            tool.started = true;
        };

        this.mousemove = function (ev) {
            if (tool.started) {
                context.strokeStyle = color;
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
            context.strokeStyle = "#000000";
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
                    console.log(w + " " + h);
                    
                if (w > 100 && h > 100) {
                   cropImage(x, y, w, h);        
                }
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

        $(".upload-container").css('width', w);
        $(".upload-container").css('height', h);
        canvas.width = w;
        canvas.height = h;
    }
    
    function resize(toCanvas, fromCanvas, points, newW, newH){
        var temp_cnvs = document.createElement('canvas');
        var temp_cntx = temp_cnvs.getContext('2d');
        var toContext = toCanvas.getContext('2d');

        temp_cnvs.imageSmoothingEnabled = false;
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
            
            context.strokeStyle = color;
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
            context.strokeStyle = color;
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
        var wWidth = $(window).width() * 0.9;
        var wHeight = $(window).height() * 0.8;

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
        
        return [Math.round(w), Math.round(h)];
    }
    
    var oldImage;
    
    function ShowImage(file) {        
        var reader = new FileReader();
        $("#upload-area").css('cursor', 'default');
        reader.onload = function(e) {
            var img = new Image();
            
            img.onload = function () {                            
                var w, h;
                dim = calculateDimensions(img.width, img.height);
                w = Math.round(dim[0]);
                h = Math.round(dim[1]);
                
                $("#upload-area").attr("id", "edit-container");
                $("#edit-container").html('<canvas id="imageView"><p>hovnoooooooooooooooooooooo</p>');
                var canvas = document.getElementById('imageView');            
                context = canvas.getContext('2d');
                
                canvas.width = w;
                canvas.height = h;
                canvas.imageSmoothingEnabled = false;
                context.drawImage(img, 0, 0, img.width, img.height, // source rectangle
                        0, 0, w, h);

                $("#main").css("width", 'auto');
                $(".upload-container").css('width', canvas.width);
                $(".upload-container").css('height', canvas.height);
                $("#progress-container").css('width', canvas.width);

                initEdit();
                
                canvasF.width = img.width;
                canvasF.height = img.height;
                contextF.drawImage(img, 0, 0);   
                
                oldImage = img;
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
                $("#progress progress").attr('value', percentComplete);
                $("#progress-bar").width(percentComplete + '%');
            }
        }, false);

        xhr.onreadystatechange = function(e) {
            if (xhr.readyState === 4) {
                console.log(xhr.status == 200 ? "success" : "failure");
                var response = $.parseJSON(xhr.responseText);
                if (response.state == "success") {
                    ShowImage(file);
                    $("#result").html('<input id="result-input" type="text" value="' + window.location.href + response.code + '" autofocus="autofocus">').hide().fadeIn( "fast" );
                    $("#result-input").select();
                    $("#progress-container").fadeOut();
                    code = response.code;
                    token = response.token;
                }
            }
        };

        xhr.open("POST", uploadLink, true);
        xhr.setRequestHeader("X_FILENAME", file.name);

        $("#progress-container").html('<div id="progress-div"><div id="progress-bar"></div></div>');

        xhr.send(file);
    }
    
    function UploadFile(file) {
        
        if (checkFile(file)) {
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
    
    function CleanImage() {
        console.log('clean');
        context.clearRect(0, 0, canvas.width, canvas.height);
        contexto.clearRect(0, 0, canvaso.width, canvaso.height);
        context.drawImage(oldImage, 0, 0, oldImage.width, oldImage.height, // source rectangle
                        0, 0, canvaso.width, canvaso.height);
        contextF.drawImage(oldImage, 0, 0, oldImage.width, oldImage.height, // source rectangle
                        0, 0, canvasF.width, canvasF.height);
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
            $('.toolbox .item .save').removeClass('selected');
            $('.toolbox .item .pencil').addClass('selected');
        });
    }
    
    function dataURItoBlob (dataURI) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab],{type: mimeString});
    }
    
    var calls = 0;
    
    function waitforpastedata () {
        calls++;
        console.log("waiting" + calls);
        img = $("#upload-area img");
        if (img.length > 0) {
            
            file = dataURItoBlob(img[0].src);
            $("#upload-area").attr('contenteditable', false);
            $("#upload-area").css('cursor', 'default');
            UploadFile(file);
        } else {
            $("#upload-area").empty();
            if (calls > 20) {
                $("#upload-area").css('cursor', 'default');
                calls = 0;
                swal({
                    title: "Timeout!",
                    text: "Nepovedlo se načíst žádný obrázek.",
                    type: "error"
                });
            } else {         
                $("#upload-area").empty();
                that = {}
                that.callself = function () {
                        waitforpastedata()             
                }
                setTimeout(that.callself,20);
            }
        }
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
        if (e && e.originalEvent && e.originalEvent.clipboardData && e.originalEvent.clipboardData.items) {
            console.log("clipboard");
            $("#upload-area").html("<p>Vložte obrázek ze schránky pomocí ctrl+v<br>nebo ho sem přetáhněte</p>");
            var item = e.originalEvent.clipboardData.items[0];
            UploadFile(item.getAsFile());
            
        } else {
            console.log("paste to to block");
            $("#upload-area").html("<p>Vložte obrázek ze schránky pomocí ctrl+v<br>nebo ho sem přetáhněte</p>");
            $("#upload-area img").hide();
            $("#upload-area").css('cursor', 'wait');
            waitforpastedata();
        }
    }
    
    $(document).on('click', '.toolbox .item', function(e) {       
       if ($(this).hasClass('pencil')) {
           tool = new tools['pencil']();
       } 
       else if ($(this).hasClass('rectangle')) {
           tool = new tools['rect']();
       }
       else if ($(this).hasClass('line')) {
           tool = new tools['line']();
       }
       else if ($(this).hasClass('crop')) {
           tool = new tools['crop']();
       }
       else if ($(this).hasClass('save')) {
           UpdateImage();   
           return;
       }
       else if ($(this).hasClass('view')) {
           window.location.href = window.location.href + code;
           return; 
       }       
       else if ($(this).hasClass('picker')) {
           return; 
       }   
       else if ($(this).hasClass('rubber')) {
           CleanImage();   
           return;
       }
       
       $('.toolbox .item').removeClass('selected');
       $(this).addClass('selected');
    });
    
    $(document).on('click', '#save-btn', function(e) {
        e.preventDefault();
        UpdateImage();
    });    
    
    $("#upload-area").keypress(function(e){ e.preventDefault() });

    $(document).ready(function() {
        $(document).on("paste", PasteEvent);
        $("#upload-area").on("dragover", FileDragHover);
        $("#upload-area").on("dragleave", FileDragHover);
        $("#upload-area").on("drop", FileSelectHandler);        
        $("#upload-area").focus();
        var $box = $('#colorPicker');
        $box.tinycolorpicker();
        box = $box.data("plugin_tinycolorpicker");
        box.setColor('rgb(3, 145, 206)');
        color = box.colorHex;
        var pencil = $('.toolbox .pencil');
        $box.bind("change", function() {

            color = box.colorHex;

            if (tool == null) {
                tool = new tools['pencil']();
                
                pencil.addClass('selected');
            }
                
        });
    });
})();


