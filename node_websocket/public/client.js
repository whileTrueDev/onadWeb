$(function(){
    var socket = io();
    var _url = window.location.href;
    var myArray = ['eating', 'game']
    var rand = myArray[Math.floor(Math.random() * myArray.length)];
   
    socket.emit('new client', _url); //접속했다고 서버에 알려줌

    socket.emit('request img', [_url, rand]); // 접속 시 서버에 광고 이미지를 요청한다.
    
    socket.on('redirect warn', function(destination){ // 중복접속 막는다
        window.location.href = destination
    })
    socket.on('img receive', function(msg){
        $('#imgMessage').empty().append(`<img src= ${msg[0]} id='showBanner' name= ${msg[1]} width = '100%' height = '100%'>`)    
    });
    
    socket.on('response banner data to server', function(){ //
        var bannerName = $("#showBanner").attr("name")
        socket.emit('write to db', [bannerName, _url, rand]);
    });

    socket.on('check bannerId', function(){
        var bannerId = $("#showBanner").attr("name")
        socket.emit('check plz', [_url, rand, bannerId])
    })
});