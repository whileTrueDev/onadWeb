$(function(){
    var socket = io();
    var _url = window.location.href;

    socket.emit('new client', _url);

    socket.emit('request img',{}); // 접속 시 서버에 광고 이미지를 요청한다.

    socket.on('img receive', function(msg){
        $('#imgMessage').empty().append(`<img src= ${msg[0]} id='showBanner' name= ${msg[1]} width = '100%' height = '100%'>`)    
    });
    
    socket.on('response banner data to server', function(){
        var bannerName = $('#showBanner')[0].name;
        socket.emit('write to db', [bannerName, _url]);
    });
});