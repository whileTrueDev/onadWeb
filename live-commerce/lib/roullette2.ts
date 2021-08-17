/* external js
//cdnjs.cloudflare.com/ajax/libs/gsap/2.1.0/TweenMax.min.js
*/

function roullette(socket: any, targetCustomers: string[]) {
  let selectedIndex: number;
  const targetCustomerIds = targetCustomers;
  const rotationPos = [60, 120, 180, 240, 300, 360];

  $(function () {
    TweenLite.to($('.board_on'), 360, { css: { rotation: -4000 }, ease: Linear.easeNone });
    for (let i = 0; i < 6; i += 1) {
      $('.borad-on').css({ width: '10px' });
      $('.board-on').append(`<p>${targetCustomerIds[i]}</p>`);
    }
  });
  function endGame() {
    $('.board-start').addClass('done');
    $('.board-start').text(`${targetCustomerIds[selectedIndex]}`);
  }

  function startLot(index: number) {
    selectedIndex = index;
    TweenLite.killTweensOf($('.board-on'));
    TweenLite.to($('.board-on'), 0, { css: { rotation: rotationPos[selectedIndex] } });
    TweenLite.from($('.board-on'), 5, {
      css: { rotation: -3000 },
      onComplete: endGame,
      ease: Sine.easeOut,
    });
  }

  socket.on('roullette start', () => {
    startLot(Math.floor(Math.random() * 6));
  });
}

export default roullette;
