function hiddenEventHandler(socket: any) {
  const visibilityChange: string = 'visibilityChange'
  const hidden: keyof typeof document = 'hidden';

  function handleVisibilityChange(): void {
    if (document[hidden]) {
      // socket.emit('pageActive handler', [cutUrl, 0, program]);
      // $('#imgMessage').empty();
      console.log('hidden')
      socket.emit('hiddenTest', 'hidden')
    } else {
      // socket.emit('pageActive handler', [cutUrl, 1, program]);
      // socket.emit('pageActive', _url);
      console.log('show')
      socket.emit('showTest', 'show')
    }
  }

  if (typeof document.addEventListener === 'undefined' || typeof document.hidden === 'undefined') {
    alert('지원하지 않는 브라우저입니다. 크롬에서 시도해주세요.');
  } else {
    // Handle page visibility change
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
  }
}

export { hiddenEventHandler }