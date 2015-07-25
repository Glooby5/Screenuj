(function() {
    function UploadFile(file) {
        data = new FormData();
        data.append('image', file);
        
        $.ajax({
            url: uploadLink,
            type: "POST",
            data: data,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res);
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
    }
    
    function PasteEvent(e) {
        //console.log(e.originalEvent.clipboardData.items[0].getAsFile());
        var item = e.originalEvent.clipboardData.items[0];
        UploadFile(item.getAsFile());
    }

    $(document).ready(function() {
        //window.addEventListener("paste", pasteEvent);
        $(window).on("paste", PasteEvent);
        $("#upload-area").on("dragover", FileDragHover);
        $("#upload-area").on("dragleave", FileDragHover);
        $("#upload-area").on("drop", FileSelectHandler);
    });
    

    
    


})();
