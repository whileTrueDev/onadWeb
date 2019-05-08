$(function(){
    var socket = io();
    var _url = window.location.href;
    // var startTime = new Date.getTime()
    // var endTime = new Date.getTime()
    // var _urlPath = window.location.pathname.substring(8)
    socket.emit('new client', _url);
    $('form').submit(function(){
        socket.emit('img send', $('#source').text());
        return false;
    });
    socket.on('text receive', function(msg){
        $('textArea').empty().append(`<MARQUEE>${ msg }</MARQUEE>`)
    });
});
