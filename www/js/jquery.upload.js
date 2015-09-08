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
        
        // Find the canvas element.
        canvaso = document.getElementById('imageView');
        
        if (!canvaso) {
            alert('Error: I cannot find the canvas element!');
            return;
        }

        if (!canvaso.getContext) {
            alert('Error: no canvas.getContext!');
            return;
        }

        // Get the 2D canvas context.
        contexto = canvaso.getContext('2d');
        
        
        if (!contexto) {
            alert('Error: failed to getContext!');
            return;
        }

        // Add the temporary canvas.
        var container = canvaso.parentNode;
        canvas = document.createElement('canvas');
        if (!canvas) {
            alert('Error: I cannot create a new canvas element!');
            return;
        }
        
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
        //container.appendChild(canvasF);
        contextF = canvasF.getContext('2d');

        // Get the tool select input.
        var tool_select = document.getElementById('dtool');
        if (!tool_select) {
            alert('Error: failed to get the dtool element!');
            return;
        }
        tool_select.addEventListener('change', ev_tool_change, false);

        // Activate the default tool.
        if (tools[tool_default]) {
            tool = new tools[tool_default]();
            tool_select.value = tool_default;
        }
        
        context.imageSmoothingEnabled = true;
        
        canvas.addEventListener('mousedown', ev_canvas, false);
        canvas.addEventListener('mousemove', ev_canvas, false);
        canvas.addEventListener('mouseup', ev_canvas, false);
    }
    
    // The general-purpose event handler. This function just determines the mouse 
    // position relative to the canvas element.
    function ev_canvas(ev) {
        if (ev.layerX || ev.layerX == 0) { // Firefox
            ev._x = ev.layerX;
            ev._y = ev.layerY;
        } else if (ev.offsetX || ev.offsetX == 0) { // Opera
            ev._x = ev.offsetX;
            ev._y = ev.offsetY;
        }

        // Call the event handler of the tool.
        var func = tool[ev.type];
        if (func) {
            func(ev);
        }
    }
    
    // The event handler for any changes made to the tool selector.
    function ev_tool_change (ev) {
        if (tools[this.value]) {
            tool = new tools[this.value]();
        }
    }
    
    // This function draws the #imageTemp canvas on top of #imageView, after which 
    // #imageTemp is cleared. This function is called each time when the user 
    // completes a drawing operation.
    function img_update() {
        
        contexto.drawImage(canvas, 0, 0);
        contextF.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvasF.width, canvasF.height);
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    
     // This object holds the implementation of each drawing tool.
    var tools = {};

    // The drawing pencil.
    tools.pencil = function () {
        var tool = this;
        this.started = false;
        
        context.lineWidth = 2;
        context.strokeStyle = "red";

        // This is called when you start holding down the mouse button.
        // This starts the pencil drawing.
        this.mousedown = function (ev) {
            context.beginPath();
            context.moveTo(ev._x, ev._y);
            tool.started = true;
        };

        // This function is called every time you move the mouse. Obviously, it only 
        // draws if the tool.started state is set to true (when you are holding down 
        // the mouse button).
        this.mousemove = function (ev) {
            if (tool.started) {
                context.lineTo(ev._x, ev._y);
                context.stroke();
            }
        };

        // This is called when you release the mouse button.
        this.mouseup = function (ev) {
            if (tool.started) {
                tool.mousemove(ev);
                tool.started = false;
                img_update();
            }
        };
    };
    
    // The drawing pencil.
    tools.highlighter = function () {
        var tool = this;
        this.started = false;
        
        context.lineWidth = 15;
        contexto.strokeStyle = "rgba(255,197,82,0.05)";

        // This is called when you start holding down the mouse button.
        // This starts the pencil drawing.
        this.mousedown = function (ev) {
            context.strokeStyle = "rgba(255,197,82,0.05)";
            context.beginPath();
             context.strokeStyle = "rgba(255,197,82,0.05)";         
            context.moveTo(ev._x, ev._y);
            tool.started = true;
        };

        // This function is called every time you move the mouse. Obviously, it only 
        // draws if the tool.started state is set to true (when you are holding down 
        // the mouse button).
        this.mousemove = function (ev) {
            if (tool.started) {
                context.strokeStyle = "rgba(255,197,82,0.05)";
                context.lineTo(ev._x, ev._y);
                context.stroke();
                 context.strokeStyle = "rgba(255,197,82,0.05)";
            }
        };

        // This is called when you release the mouse button.
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
            //console.log('x: ' + x + ', y: ' + y + ', w: ' + w + ', h: ' + h );
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
                console.log('x: ' + x + ', y: ' + y + ', w: ' + w + ', h: ' + h );
                
//                canvasF.width = w;                
//                canvasF.height = h;
//                var canvasTmp = canvaso;
                

                var scaleX = canvasF.width / canvas.width;
                
                contextF.drawImage(canvasF, x * scaleX, y * scaleX, w * scaleX, h * scaleX, 0, 0, w * scaleX, h * scaleX);
                //contexto.drawImage(canvaso, x, y, w, h, 0, 0, w, h);
                
                
                var temp_cnvs = document.createElement('canvas');
                var temp_cntx = temp_cnvs.getContext('2d');
            // set it to the new width & height and draw the current canvas data into it // 
                temp_cnvs.width = w; 
                temp_cnvs.height = h;
                temp_cntx.drawImage(canvaso, x, y, w, h, 0, 0, w, h);
            // resize & clear the original canvas and copy back in the cached pixel data //
                canvaso.width = w; 
                canvaso.height = h;
                contexto.drawImage(temp_cnvs, 0, 0);
                
                
                context.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = w; 
                canvas.height = h;
                
                $("#edit-container").css('width', w);
                $("#edit-container").css('height', h);
//                canvaso.width = w;                
//                canvaso.height = h;
                
            }
        };
    };

    // The rectangle tool.
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
            //console.log('x: ' + x + ', y: ' + y + ', w: ' + w + ', h: ' + h );
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
                console.log('x: ' + x + ', y: ' + y + ', w: ' + w + ', h: ' + h );
                img_update();
            }
        };
    };

    // The line tool.
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


    
    function ShowImage(file) {
        //$("#upload-area").hide();
        $("#upload-area").attr("id", "edit-container");
        $("#edit-container").html('<canvas id="imageView" width="1000"  height="700"><p>hovnoooooooooooooooooooooo</p>');
        
        var reader = new FileReader();
        reader.onload = function(e) {
            var canvas = document.getElementById('imageView');
            
            context = canvas.getContext('2d');
            console.log(context);
            var img = new Image();
            
            img.onload = function () {
                if (img.width < 1000) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0, img.width, img.height, // source rectangle
                            0, 0, canvas.width, canvas.height);  // destination rectangle
                } else {
                    var w, h;
                    h = img.width / canvas.width;
                    h = img.height / h;
                    canvas.height = h;
                    context.drawImage(img, 0, 0, img.width, img.height, // source rectangle
                            0, 0, canvas.width, canvas.height);  // destination rectangle
                }


                $("#edit-container").css('width', canvas.width);
                $("#edit-container").css('height', canvas.height);
                $("#progress-container").css('width', canvas.width);

                initEdit();
                canvasF.width = img.width;
                canvasF.height = img.height;
                                console.log(contextF);
                                console.log(canvasF)
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
