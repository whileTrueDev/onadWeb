function imageClicker(socket: any, THIS_URL: string, programType: string): void {
  $(document).ready(() => {
    let onOff = true;
    const cutUrl = `/${THIS_URL.split('/')[4]}`;

    $('.banner-box').dblclick(() => {
      $('.banner-box').toggleClass('hidden');
      onOff = !onOff;
      socket.emit('banner click', [cutUrl, onOff, programType]);
    });
  });
}

export default imageClicker;
