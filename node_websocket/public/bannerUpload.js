$(document).ready(function(){
    var tmp = null;
    function readImage(input) {
        if ( input.files && input.files[0] ) {
            var FR= new FileReader();
            FR.onload = function(e) {                           
                tmp = $('#source').text(e.target.result);                           
            };       
            FR.readAsDataURL( input.files[0] );
        };
    };

    $(document).ready(function(){
        $("#baseFile").change(function(){
            readImage( this );
        });
        $("#baseFile").trigger("change");
    });
});