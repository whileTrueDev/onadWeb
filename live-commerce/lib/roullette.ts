// /* external js
// //cdnjs.cloudflare.com/ajax/libs/gsap/2.1.0/TweenMax.min.js
// */

// $(document).ready(function () {
//   let gift: number;
//   const present = [1, 2, 3, 4, 5, 6];

//   iniGame = function (num: number) {
//     gift = num;
//     TweenLite.killTweensOf($('.board_on'));
//     TweenLite.to($('.board_on'), 0, { css: { rotation: rotationPos[gift] } });
//     TweenLite.from($('.board_on'), 5, {
//       css: { rotation: -3000 },
//       onComplete: endGame,
//       ease: Sine.easeOut,
//     });
//     console.log(`gift 숫자 : ${gift + 1}rotationPos${rotationPos}`);
//   };

//   var rotationPos = [60, 120, 180, 240, 300, 360];

//   TweenLite.to($('.board_on'), 360, { css: { rotation: -4000 }, ease: Linear.easeNone });
//   function endGame() {
//     const copImg = `http://img.babathe.com/upload/specialDisplay/htmlImage/2019/test/coupon${
//       gift + 1
//     }.png`;
//     console.log(`이미지 : ${copImg}`);

//     $('#popup_gift .lottery_present').text(function () {
//       return `축하드립니다.${present[gift]} 룰렛숫장${gift + 1} 당첨 되셨습니다.`;
//     });
//     $(`<img  src="${copImg}" />`).prependTo('#popup_gift .lottery_present');
//     setTimeout(function () {
//       openPopup('popup_gift');
//     }, 1000);
//   }

//   $('.popup .btn').on('click', function () {
//     location.reload();
//   });
//   function openPopup(id) {
//     closePopup();
//     $('.popup').slideUp(0);
//     const popupid = id;
//     $('body').append('<div id="fade"></div>');
//     $('#fade')
//       .css({
//         filter: 'alpha(opacity=60)',
//       })
//       .fadeIn(300);
//     const popuptopmargin = $(`#${popupid}`).height() / 2;
//     const popupleftmargin = $(`#${popupid}`).width() / 2;
//     $(`#${popupid}`).css({
//       'margin-left': -popupleftmargin,
//     });
//     $(`#${popupid}`).slideDown(500);
//   }
//   function closePopup() {
//     $('#fade').fadeOut(300, function () {
//       // $(".player").html('');
//     });
//     $('.popup').slideUp(400);
//     return false;
//   }
//   $('.close').click(closePopup);
// });

// $(function () {
//   let clicked = 0;
//   for (i = 1; i < 7; i++) {
//     // 상품쪽 이미지는 신경 안쓰셔도 됩니다!! 책임님!!!
//     const pictures = `http://img.babathe.com/upload/specialDisplay/htmlImage/2019/test/coupon${i}.png`;
//     $('.board_on').append(`<img  src="${pictures}" />`);
//   }

//   $('.join').on('mousedown', function () {
//     if (clicked <= 0) {
//       iniGame(Math.floor(Math.random() * 6));
//     } else if (clicked >= 1) {
//       event.preventDefault();
//       alert('이벤트 참여 하셨씁니다.');
//     }
//     clicked++;
//   });
// });
export {};
