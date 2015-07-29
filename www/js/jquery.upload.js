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
