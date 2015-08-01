(function() {
    function checkFile(file) {
        if (file.size > 10485760) {
            console.log("moc MB")
            return false;
        }
        
        var types = ["image/png", "image/jpeg"];        
        if (types.indexOf(file.type) === -1) {
            console.log("není to obrázek");
            return false;
        }        
        return true;
    }
    
    function initEdit () {
	// The pencil tool instance
	tool = new tool_pencil();
        console.log("init");
	// Attach the mousedown, mousemove and mouseup event listeners
	$("#imageView").on('mousedown', ev_canvas);
	$("#imageView").on('mousemove', ev_canvas);
	$("#imageView").on('mouseup', ev_canvas);
    }
    
    function tool_pencil () {
	var tool = this;
	this.started = false;

	// This is called when you start holding down the mouse button
	// This starts the pencil drawing
	this.mousedown = function (ev) {
			context.beginPath();
			context.moveTo(ev._x, ev._y);
			tool.started = true;
	};

	// This function is called every time you move the mouse. Obviously, it only
	// draws if the tool.started state is set to true (when you are holding down
	// the mouse button)
	this.mousemove = function (ev) {
		if (tool.started) {
			context.lineTo(ev._x, ev._y);
			context.stroke();
		}
	};

	// This is called when you release the mouse button
	this.mouseup = function (ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
		}
	};
    }

    // The general-purpose event handler. This function just determines
    // the mouse position relative to the <canvas> element
    function ev_canvas (ev) {
        // Firefox
        console.log("ev_canvas");
        if (ev.layerX || ev.layerX == 0) {
                ev._x = ev.layerX;
                ev._y = ev.layerY;
        // Opera
        } else if (ev.offsetX || ev.offsetX == 0) {
                ev._x = ev.offsetX;
                ev._y = ev.offsetY;
        }

        // Call the event handler of the tool
        var func = tool[ev.type];
        if (func) {
                func(ev);
        }
    }
    
    var context;
    
    function ShowImage(file) {
        $("#edit-container").html('<canvas id="imageView" width="400" height="300"></canvas>');
        
        var reader = new FileReader();
        reader.onload = function(e) {
            var canvas = document.getElementById('imageView');
            context = canvas.getContext('2d');
            console.log(context);
            var img = new Image();
            
            img.onload = function() {
                context.drawImage(img, 0, 0);
                initEdit();
            }
            
            img.src = e.target.result;
        }  
        reader.readAsDataURL(file);
    }
    
    
    function sendFile(file) {
        console.log("send file");
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
                    //$("#result-input").focus();
                    ShowImage(file);
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

    $(document).ready(function() {
        $(window).on("paste", PasteEvent);
        $("#upload-area").on("dragover", FileDragHover);
        $("#upload-area").on("dragleave", FileDragHover);
        $("#upload-area").on("drop", FileSelectHandler);
    });
})();
