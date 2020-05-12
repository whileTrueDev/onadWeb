function imageClicker(socket: any, THIS_URL: string, programType: string) {
  $(document).ready(() => {
    let onOff = true;
    const cutUrl = `/${THIS_URL.split('/')[4]}`;

    $('.img-area').dblclick(() => {
      $('.img-area').toggleClass('hidden');
      onOff = !onOff;
      socket.emit('banner click', [cutUrl, onOff, programType]);
    });
  });
}

export default imageClicker;
