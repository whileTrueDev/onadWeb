$(function(){
    var socket = io();

    socket.emit('host',{});

    // $('form').submit(function(){
    //     socket.emit('img send', $('#source').text());
    //     return false;
    // });

    $('#idSelectImgButton').click(function(){
        socket.emit('particular img send', [$('#idReceiver').val(), $('#source').text()]); // 배열로 웹소켓 아이디와 이미지 넘기기
    });

    socket.on('id receive', function(keys, socketsInfo){
        keys.forEach(function(key) {
            $('#idReceiver').append(`<option value= ${key}> ${socketsInfo[key]} </option>`); //select box로 접속 중 스트리머 표시
            console.log(socketsInfo[key])
        });
    }); 
    socket.on('id remove', function(clientId){
        $(`#idReceiver option[value= ${clientId}]`).remove();
    });

    $('#chkBoxButton').click(function(){
        socket.emit('db img send', [$('#chkImg1')[0].value, $('#chkImg1')[0].name]);
        console.log($('#chkImg1')[0].name);
    });

    socket.on('response img', function(){
        socket.emit('db img send', [$('#chkImg1')[0].value, $('#chkImg1')[0].name]);
    });

    socket.on('divReload', function(){
        $('#dbImg').load(location.href + " #dbImg");
        console.log('refresh')
    })
});
