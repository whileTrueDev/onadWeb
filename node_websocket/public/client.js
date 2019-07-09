$(function(){
    var socket = io();
    var history = window.history.length;
    var _url = window.location.href;
   
    socket.emit('new client', [_url, history]); 
    
    socket.on('redirect warn', function(destination){
        window.location.href = destination
    })
    socket.on('browser warning', function(destination){
        window.location.href = destination
    })

    socket.on('img receive', function(msg){
        $('#imgMessage').empty().append(`<img src= ${msg[0]} id='showBanner' name= ${msg[1]} width = '100%' height = '100%'>`)    
    });
    
    socket.on('response banner data to server', function(){ 
        var bannerName = $("#showBanner").attr("name")
        socket.emit('write to db', bannerName);
    });

    socket.on('check bannerId', function(){
        var bannerId = $("#showBanner").attr("name")
        socket.emit('check plz', [_url, bannerId])
    })
    socket.on('img clear', function(){
        $('#imgMessage').empty()
    })
});