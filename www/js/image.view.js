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
        
        return [w, h];
    }
    
    $(window).load(function() {
        $("#image-view img").show();
        $("#result-input").select();
        $('#main').css('width', '100%');
        image = $("#image-view img");
        console.log(image);
        res = calculateDimensions(image.width(), image.height());
        console.log(res);
        image.css('width', res[0]);
        image.css('height', res[1]);
    });

$(document).ready(function() {
    
//    $(window).resize(function() {
//    console.log("resize");
//    image = $("#image-view img");
//    console.log(image);
//    res = calculateDimensions(image.width(), image.height());
//    image.css('width', res[0]);
//    image.css('height', res[1]);
//});
});


