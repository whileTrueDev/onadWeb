function hiddenEventHandler(socket: any, THIS_URL: string, programType: string): void {
  const cutUrl = `/${THIS_URL.split('/')[4]}`;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // 숨김
      socket.emit('pageActive handler', [cutUrl, false, programType]);
      socket.close();
      $('#imgMessage').empty();
    } else if (document.visibilityState === 'visible') {
      socket.open();
      setTimeout(() => {
        socket.emit('pageActive handler', [cutUrl, true, programType]);
        socket.emit('pageOn', [THIS_URL, programType]);
      }, 1000);
    }
  });
}

export default hiddenEventHandler;
