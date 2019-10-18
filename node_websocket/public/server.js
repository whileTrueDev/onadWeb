$(() => {
  const socket = io();

  socket.emit('host', {});

  $('#idSelectImgButton').click(() => {
    socket.emit('particular img send', [$('#idReceiver').val(), $('#source').text()]); // 배열로 웹소켓 아이디와 이미지 넘기기
  });

  socket.on('id receive', (keys, socketsInfo) => {
    keys.forEach((key) => {
      $('#idReceiver').append(`<option value= ${key}> ${socketsInfo[key]} </option>`); // select box로 접속 중 스트리머 표시
    });
  });
  socket.on('id remove', (clientId) => {
    $(`#idReceiver option[value= ${clientId}]`).remove();
  });

  $('#chkBoxButton').click(() => {
    socket.emit('db img send', [$('#chkImg1')[0].value, $('#chkImg1')[0].name]);
    console.log($('#chkImg1')[0].name);
  });

  socket.on('response img', () => {
    socket.emit('db img send', [$('#chkImg1')[0].value, $('#chkImg1')[0].name]);
  });

  socket.on('divReload', () => {
    $('#dbImg').load(`${location.href} #dbImg`);
    console.log('refresh');
  });
});
