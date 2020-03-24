function hiddenEventHandler(socket: any, THIS_URL: string, programType: string) {
  const cutUrl = `/${THIS_URL.split('/')[4]}`;
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === 'hidden') {
      // 숨김
      socket.emit('pageActive handler', [cutUrl, 0, programType]);
      $('#imgMessage').empty();
    } else {
      socket.emit('pageActive handler', [cutUrl, 1, programType]);
      socket.emit('pageOn', THIS_URL);
    }
  });
}

export { hiddenEventHandler }