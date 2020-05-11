function hiddenEventHandler(socket: any, THIS_URL: string, history: number, programType: string): void {
  const cutUrl = `/${THIS_URL.split('/')[4]}`;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // 숨김
      socket.emit('pageActive handler', [cutUrl, false, programType]);
      socket.close();
      $('#imgMessage').empty();
    } else {
      socket.open();
      socket.emit('pageActive handler', [cutUrl, true, programType]);
      socket.emit('pageOn', [THIS_URL, programType]);
    }
  });
}

export default hiddenEventHandler;
