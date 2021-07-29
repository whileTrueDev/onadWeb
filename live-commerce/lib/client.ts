import { ImageData, PurchaseMessage, SinglePurchase, RankingData } from '../@types/data';

const socket: any = io({ transports: ['websocket'] });
let idArray: Array<null | string> = [];
// let rankingArray: Array<SinglePurchase> = [];
const THIS_URL: string = window.location.href;

let setDate = new Date('2021-08-07T16:00:00+0900');

let messageHtml: string;
const messageArray: any[] = [];
let bannerId = 0;
let bottomTextIndex = 0;

// 하단 marquee 영역 이벤트
// setInterval(() => {
//   if($('.bottom-area').css({ display: 'none' })) {
//     $('.bottom-area').css({ display: 'flex' })
//   }
//   if (idx >= idArray.length) {
//       idx = 0;
//     }
//   if (idArray.length){
//   $('.bottom-area-text').text(`${idArray[idx]}`)
//   $('.bottom-area-text').css({ display: 'flex' });
//   idx += 1;}
// }, 10000);

async function switchBottomText() {
  if (bottomTextIndex >= idArray.length) {
    bottomTextIndex = 0;
  }
  if (idArray.length !== 0) {
    await setTimeout(() => {
      $('.bottom-area-text').text(`${idArray[bottomTextIndex]}`).fadeIn(500);
      bottomTextIndex += 1;
    }, 1000);
    await setTimeout(() => {
      $('.bottom-area-text').fadeOut(500);
      switchBottomText();
    }, 10000);
  } else {
    await setTimeout(() => {
      switchBottomText();
    }, 10000);
  }
}

// 우측상단 응원문구 이벤트
setInterval(async () => {
  if (messageArray.length !== 0 && $('.top-right').css('display') === 'none') {
    $('.top-right').css({ display: 'flex' });
    $('.top-right').html(messageArray[0].messageHtml);
    await setTimeout(() => {
      $('.top-right').append(messageArray[0].alarmSoundTag);
      messageArray.splice(0, 1);
    }, 3000);
    await setTimeout(() => {
      $('.top-right').fadeOut(800);
      $('.donation-image').attr('src', '/public/images/invisible.png');
    }, 10000);
  }
}, 2000);

async function switchImage() {
  if (!$('.vertical-banner').attr('src')?.includes('gif')) {
    bannerId += 1;
    if (bannerId === 12) {
      bannerId = 1;
    }
    await setTimeout(() => {
      $('.vertical-banner')
        .attr('src', `/public/images/vertical-banner-${bannerId}.png`)
        .fadeIn(1000);
    }, 1000);

    await setTimeout(() => {
      $('.vertical-banner')
        .attr('src', `/public/images/vertical-banner-${bannerId}.png`)
        .fadeOut(1000);
      switchImage();
    }, 10000);
  } else {
    await setTimeout(() => {
      switchImage();
    }, 10000);
  }
}

switchBottomText();
switchImage();

function getOS(): string | null {
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

function dailyMissionTimer() {
  setInterval(function () {
    // 현재 날짜를 new 연산자를 사용해서 Date 객체를 생성
    const now = new Date();
    let distance = setDate.getTime() - now.getTime();
    if (distance < 0) {
      distance = 0;
    }
    let hours: string | number = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes: string | number = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds: string | number = Math.floor((distance % (1000 * 60)) / 1000);

    hours = hours < 10 ? `0${String(hours)}` : String(hours);
    minutes = minutes < 10 ? `0${String(minutes)}` : String(minutes);
    seconds = seconds < 10 ? `0${String(seconds)}` : String(seconds);

    if (hours !== '00') {
      $('#time-hour').show();
      $('#hour-min-separator').show();
      $('#time-hour').text(hours);
    } else {
      $('#time-hour').css({ display: 'none' });
      $('#hour-min-separator').css({ display: 'none' });
    }
    $('#time-min').text(minutes);
    $('#time-sec').text(seconds);

    if (
      hours !== '00' &&
      ($('.bottom-timer').attr('class')?.includes('warning') ||
        $('.bottom-timer').attr('class')?.includes('urgent'))
    ) {
      if ($('.bottom-timer').attr('class')?.includes('warning')) {
        $('.bottom-timer').removeClass('warning');
      } else {
        $('.bottom-timer').removeClass('urgent');
        $('.bottom-area-left-icon#clock').removeClass('urgent');
      }
    }

    if (
      hours === '00' &&
      Number(minutes) < 5 &&
      Number(minutes) !== 0 &&
      !$('.bottom-timer').attr('class')?.includes('urgent')
    ) {
      $('.bottom-timer').addClass('urgent');
      $('.bottom-area-left-icon#clock').addClass('urgent');
    } else if (
      hours === '00' &&
      Number(minutes) < 10 &&
      Number(minutes) !== 0 &&
      !$('.bottom-timer').attr('class')?.includes('warning')
    ) {
      $('.bottom-timer').addClass('warning');
    } else if (
      hours === '00' &&
      $('.bottom-area-left-icon#clock').attr('class')?.includes('urgent') &&
      Number(minutes) > 5 &&
      Number(minutes) < 10
    ) {
      $('.urgent').toggleClass('warning');
      $('.bottom-area-left-icon#clock').removeClass('warning');
    } else if (
      hours === '00' &&
      $('.bottom-area-left-icon#clock').attr('class')?.includes('urgent') &&
      Number(minutes) > 10
    ) {
      $('.bottom-timer').removeClass('urgent');
      $('.bottom-area-left-icon#clock').removeClass('urgent');
    }
  }, 1000);
}

// ------------------------------------- 타이머 실행 --------------------------
dailyMissionTimer();
// ---------------------------------------- 소켓 ------------------------------------
const device: string | null = getOS();

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
      <img src=${data.imgUrl} class="vertical-banner" alt="세로배너영역">
    `);
      break;
    case 'bottom':
      $('.bottom-area-right').empty().append(`
      <img src=${data.imgUrl} class="bottom-live-commerce" width="100%" height="100%">
    `);
      break;
    case 'logo':
      $('.top-right-logo').empty().append(`
          <img src=${data.imgUrl} class="logo-live-commerce" width="100%" height="100%">
      `);
      break;
    default:
      break;
  }
});

socket.on('get top-left ranking', (data: RankingData[]) => {
  const rankingArray = data;
  if ($('.ranking-text-area#title').css('display') === 'none') {
    rankingArray.map((value, index) => {
      $(`.ranking-text-area-id#rank-${index}`).text(value.nickname);
      $(`.quantity#rank-${index}`).text(`${value.total}개`);
    });
  } else {
    $('.ranking-text-area#title').css({ display: 'none' });
    $('.ranking-area-inner').html(
      `<p class="ranking-text-area" id="rank-0">
        <span class="ranking-id-wrapper">
          <img src="/public/images/crown.png" id="ranking-icon" />
          <span class="ranking-text-area-id" id="rank-0">
          </span>
        </span>
        <span class="quantity" id="rank-0">
        </span>
      </p>

      <p class="ranking-text-area" id="rank-1">
        <span class="ranking-id-wrapper">
          <img src="/public/images/first.png" id="ranking-icon" />
          <span class="ranking-text-area-id" id="rank-1">
          </span>
        </span>
        <span class="quantity" id="rank-1">
        </span>
      </p>
      <p class="ranking-text-area" id="rank-2">
        <span class="ranking-id-wrapper">
          <img src="/public/images/second.png" id="ranking-icon" />
          <span class="ranking-text-area-id" id="rank-2">
          </span>
        </span>
        <span class="quantity" id="rank-2">
        </span>
        <p class="ranking-text-area" id="rank-3">
        <span class="ranking-id-wrapper">
          <img src="/public/images/third.png" id="ranking-icon" />
          <span class="ranking-text-area-id" id="rank-3">
          </span>
        </span>
        <span class="quantity" id="rank-3">
        </span>
      </p>`,
    );
    rankingArray.map((value, index) => {
      $(`.ranking-text-area-id#rank-${index}`).text(value.nickname);
      $(`.quantity#rank-${index}`).text(`${value.total}개`);
    });
  }
});

// 우측 상단 응원 문구
socket.on('get right-top purchase message', async (data: any) => {
  const alarmType = data[0].icon;
  const { userId } = data[0];
  const { productName } = data[0];
  const { text } = data[0];
  const num = data[0].purchaseNum;
  let url;

  if (data) {
    const blob = new Blob([data[1]], { type: 'audio/mp3' });
    url = window.URL.createObjectURL(blob);
  }

  const alarmSoundTag = `<iframe src="${url}" id="iframeAudio" allow="autoplay" style="display:none"></iframe>`;

  messageHtml = `
  <div class="donation-wrapper">
    <iframe src="/public/audio/${
      alarmType === '2' ? 'alarm-type-2.wav' : 'alarm-type-1.wav'
    }" id="iframeAudio" allow="autoplay" style="display:none"></iframe>
    <div class="item">
      <div class="centered">
      <img src="/public/images/${
        alarmType === '2' ? 'donation-2.gif' : 'donation-1.gif'
      }" class="donation-image"/>
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
  </div>
  `;
  messageArray.push({ alarmSoundTag, messageHtml });
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
  $('.bottom-area-right')
    .prepend(
      `
    <p class="bottom-admin">
      ${data}
    </p>
  `,
    )
    .fadeIn(1000);
  $('.bottom-area-text').fadeOut(1000);
  setTimeout(() => {
    $('.bottom-admin').remove();
    $('.bottom-area-text').fadeIn(5000);
  }, 10000);
});

// 응원메세지 marquee
socket.on('get bottom purchase message', (data: string[]) => {
  // idArray.push(data);
  idArray = data;
});

// 하단 비우기
socket.on('clear bottom area to client', () => {
  $('.bottom-area-right').css({ opacity: 0 });
  idArray.length = 0;
});

// 랭킹 비우기
socket.on('clear ranking area', () => {
  $('.ranking-area-inner').html(
    `
    <p class="ranking-text-area" id="rank-0">
    <span class="ranking-id-wrapper">
      <img src="/public/images/crown.png" id="ranking-icon" />
      <span class="ranking-text-area-id" id="rank-0">
      </span>
    </span>
    <span class="quantity" id="rank-0">
    </span>
  </p>

  <p class="ranking-text-area" id="rank-1">
    <span class="ranking-id-wrapper">
      <img src="/public/images/second.png" id="ranking-icon" />
      <span class="ranking-text-area-id" id="rank-1">
      </span>
    </span>
    <span class="quantity" id="rank-1">
    </span>
  </p>
  <p class="ranking-text-area" id="rank-2">
    <span class="ranking-id-wrapper">
      <img src="/public/images/third.png" id="ranking-icon" />
      <span class="ranking-text-area-id" id="rank-2">
      </span>
    </span>
    <span class="quantity" id="rank-2">
    </span>
  </p>
  `,
  );
  // rankingArray.length = 0;
});

// 하단 다시 띄우기
socket.on('show bottom area to client', () => {
  $('.bottom-area-right').css({ opacity: 1 }).fadeIn(2000);
});

socket.on('show screen', () => {
  $(document.body).fadeIn(1000);
});

socket.on('clear screen', () => {
  $(document.body).fadeOut(1000);
});

socket.on('show virtual ad to client', () => {
  $('#virtual-ad-img').attr('src', '/public/images/yori-virtual-ad.gif');
  setTimeout(() => {
    $('#virtual-ad-img').attr('src', '/public/images/invisible.png');
  }, 8980);
});

socket.on('quantity object from server', (quantityObject: string) => {
  $('#quantity-object').text(quantityObject);
  $('.bottom-object').css({
    opacity: 1,
  });
});

socket.on('get current quantity', (currentQuantity: number) => {
  $('#current-quantity').text(currentQuantity);
});

socket.on('d-day from server', (date: string) => {
  setDate = new Date(date);
});

socket.on('refresh signal', () => {
  location.reload();
});

export {};
