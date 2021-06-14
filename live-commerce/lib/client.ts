import { ImageData, PurchaseMessage, SinglePurchase } from '../@types/data';

const socket: any = io({ transports: ['websocket'] });
const idArray: Array<null|string> = [];
const rankingArray: Array<SinglePurchase> = [];
const THIS_URL: string = window.location.href;
const ICON_ARRAY = ['crown', 'second', 'third'];

let messageHtml: string;
const messageArray: string[] = [];
let idx = 0;

// 하단 marquee 영역 이벤트
setInterval(() => {
  if (idx >= idArray.length) {
    idx = 0;
  }
  if ($('.bottom-area-text').css({ display: 'none' }) && idArray.length && idArray[idx]) {
    $('.bottom-area-wrapper').html(`<div class="bottom-area"><p class="bottom-area-text">${idArray[idx]}</p></div>`);
    $('.bottom-area-wrapper').css({ display: 'flex' });
    idx += 1;
  } else { $('.purchase-customer-id').html('<p></p>'); }
}, 10000);

// 우측상단 응원문구 이벤트
setInterval(async () => {
  if (messageArray.length !== 0 && $('.top-right').css('display') === 'none') {
    $('.top-right').css({ display: 'flex' });
    $('.top-right').html(messageArray[0]);

    messageArray.splice(0, 1);
    await setTimeout(() => {
      $('.top-right').fadeOut(1000);
    }, 10000);
  }
}, 2000);

function getOS(): string|null {
  const { userAgent } = window.navigator;
  const { platform } = window.navigator;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

const device: string|null = getOS();

socket.emit('new client', { THIS_URL, device });

socket.on('live commerce begun', () => {
  $('.banner-box').fadeOut(1000, () => {
    $('.img-area').empty();
  });

  $('.bottom-area-wrapper').css({ display: 'flex' });
  $('.live-commerce-area').show();
});
// 라이브커머스 종료
socket.on('live commerce end', () => {
  $('.live-commerce-area').fadeOut(1000);
});

// 이미지 핸들
socket.on('get live commerce image', (data: ImageData) => {
  switch (data.which) {
    case 'left':
      $('.left-banner-area').empty().append(`
      <img src=${data.imgUrl} class="left-live-commerce" width="100%" height="100%">
    `);
      break;
    case 'bottom':
      $('.bottom-area').empty().append(`
      <img src=${data.imgUrl} class="bottom-live-commerce" width="100%" height="100%">
    `);
      break;
    case 'logo':
      $('.top-right-logo').empty().append(`
          <img src=${data.imgUrl} class="logo-live-commerce" width="100%" height="100%">
      `);
      break;
    default: break;
  }
});

function compare(a: SinglePurchase, b: SinglePurchase): number {
  if (a.purchaseNumber > b.purchaseNumber) {
    return -1;
  }

  return 1;
}

socket.on('get top-left ranking', (data: PurchaseMessage) => {
  const { userId } = data;
  const { purchaseNum } = data;
  const singlePurchase: SinglePurchase = { name: '', purchaseNumber: 0 };
  singlePurchase.name = userId;
  singlePurchase.purchaseNumber = Number(purchaseNum);
  rankingArray.push(singlePurchase);

  rankingArray.sort(compare);
  if (rankingArray.length > 3) {
    rankingArray.splice(4);
  }
  rankingArray.map((puschaseInfo, index: number) => (
    $(`.inner-text-area-id#rank-${index}`).text !== Object.values(puschaseInfo)[0] ? $(`.inner-text-area#rank-${index}`).html(`
    <img src="/public/images/${ICON_ARRAY[index]}.png" id="ranking-icon"/>
    <span class="inner-text-area-id" id=${index}>${Object.values(puschaseInfo)[0]}</span>님 ${Object.values(puschaseInfo)[1]}개 구매`)
      : null
  ));
});

// 우측 상단 응원 문구
socket.on('get right-top purchase message', (data: PurchaseMessage) => {
  const alarmType = data.icon;
  const { userId } = data;
  const { productName } = data;
  const { text } = data;
  const num = data.purchaseNum;
  messageHtml = `
  <iframe src="/public/audio/${alarmType === '2' ? 'alarm-type-2.mp3' : 'alarm-type-1.wav'}" id="iframeAudio" allow="autoplay" style="display:none"></iframe>
  <div class="item">
    <div class="centered">

      <img src="/public/images/${alarmType === '2' ? 'mars-2.gif' : 'mars-1.gif'}" id="donation-image"/>
      <div class ="animated heartbeat" id="donation-top">
        <span id="nickname">
          <span class="animated heartbeat" id="donation-user-id">${userId}</span>
          <span class="donation-sub">님 ${productName}</span>
          <span class="animated heartbeat" id="donation-num">${num}</span>
          <span class="donation-sub">개 구매!</span>
        </span>
      </div>
      <div class="animated tada delay-1s" id="donation-message">
        <span id="message">
          ${text}
        </span>
      </div>
    </div>
  </div>
  `;
  messageArray.push(messageHtml);
});

// ---------------------------- 추후 삽입 가능 --------------------------
// if (messageArray.length === 0)  {
//   messageArray.push(messageHtml)
//   // socket.emit('call myself')
// } else {
//   messageArray.push(messageHtml)
// }
// socket.on('call myself', async () => {
//   if (messageArray.length !== 0) {
//     $('.top-right').css({display:'flex'})
//     $('.top-right').html(messageArray[0]);

//     messageArray.splice(0, 1)
//     await setTimeout(() => {
//         $('.top-right').fadeOut(1000)
//       }, 10000)
//     socket.emit('call myself')
//   }
// })
// ----------------------------------------------------------------------

// 하단 메세지 (단순 답변)
socket.on('get bottom area message', (data: string) => {
  $('.bottom-area-wrapper').html(`
  <p class="bottom-area-text" id="bottom-admin">
    ${data}
  </p>`).fadeIn(1000);
  setTimeout(() => {
    $('.bottom-area-text').fadeOut(1000);
  }, 5000);
});

// 응원메세지 marquee
socket.on('get bottom purchase message', (data: string) => {
  idArray.push(data);
});

// 하단 비우기
socket.on('clear bottom area to client', () => {
  $('.bottom-area-wrapper').empty();
  $('.bottom-area-wrapper').fadeOut(1000);
  idArray.length = 0;
});

// 랭킹 비우기
socket.on('clear ranking area', () => {
  $('.inner-text-area-wrapper').html(
    `
    <p class="inner-text-area" id="rank-0">
      <span class="inner-text-area-id">
      </span>
    </p>
    <p class="inner-text-area" id="rank-1">
      <span class="inner-text-area-id">
      </span>
    </p>
    <p class="inner-text-area" id="rank-2">
      <span class="inner-text-area-id">
      </span>
    </p>
  `
  );
  rankingArray.length = 0;
});

// 하단 다시 띄우기
socket.on('show bottom area to client', () => {
  $('.bottom-area-wrapper').show().fadeIn(2000);
});

socket.on('show screen', () => {
  $(document.body).fadeIn(1000);
});

socket.on('clear screen', () => {
  $(document.body).fadeOut(1000);
});


export { };
