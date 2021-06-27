import { ImageData, PurchaseMessage, SinglePurchase, RankingData } from '../@types/data';

const socket: any = io({ transports: ['websocket'] });
const idArray: Array<null|string> = [];
const rankingArray: Array<SinglePurchase> = [];
const THIS_URL: string = window.location.href;
// const ICON_ARRAY = ['crown', 'second', 'third'];

let messageHtml: string;
const messageArray: string[] = [];
let idx = 0;

// 하단 marquee 영역 이벤트
setInterval(() => {
  if (idx >= idArray.length) {
    idx = 0;
  }
  if ($('.bottom-area-text').css({ display: 'none' }) && idArray.length && idArray[idx]) {
    $('.bottom-area-text').text(`${idArray[idx]}`)
    $('.bottom-area-text').css({ display: 'flex' });
    idx += 1;
  } else { $('.purchase-customer-id').html('<p></p>'); }
}, 10000);

// 우측상단 응원문구 이벤트
setInterval(async () => {
  if (messageArray.length !== 0 && $('.top-right').css('display') === 'none') {
    $('.top-right').css({ display: 'flex' })
    $('.top-right').html(messageArray[0])
    messageArray.splice(0, 1);
    await setTimeout(() => {
      $('.top-right').fadeOut(800)
      $('.donation-image').attr('src','/public/images/invisible.png');
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

// function dailyMissionTimer(duration:number) {
    
//   let timer = duration * 60;
//   let hours, minutes, seconds;
  
//   const interval = setInterval(function(){
//       hours	= parseInt(String(timer / 3600), 10);
//       minutes = parseInt(String(timer / 60 % 60), 10);
//       seconds = parseInt(String(timer % 60), 10);
  
//       hours 	= hours < 10 ? "0" + hours : hours;
//       minutes = minutes < 10 ? "0" + minutes : minutes;
//       seconds = seconds < 10 ? "0" + seconds : seconds;
  
//       $('#time-hour').text(hours);
//       $('#time-min').text(minutes);
//       $('#time-sec').text(seconds);
//       if (hours === '00' 
//           && Number(minutes) < 5
//           && !$('.bottom-timer').attr('class')?.includes('urgent')
//       ) {
//         $('.bottom-timer').addClass('urgent')
//         $('.bottom-left-icon#clock').addClass('urgent')
//       } else if (hours === '00' 
//           && Number(minutes) < 10
//           && !$('.bottom-timer').attr('class')?.includes('warning')
//       ) {
//         $('.bottom-timer').addClass('warning')
//       } 
//       if (--timer < 0) {
//           timer = 0;
//           clearInterval(interval);
//       }
//   }, 1000);
// }

function dailyMissionTimer (){ 
  const setDate = new Date("2021-06-28T02:00:00+0900");

  setInterval(function(){
    // 현재 날짜를 new 연산자를 사용해서 Date 객체를 생성
    const now = new Date();
    let distance = setDate.getTime() - now.getTime();
    if(distance < 0) { 
      distance = 0
    }
    let hours: string|number = Math.floor((distance % (1000*60*60*24))/(1000*60*60));
    let minutes: string|number = Math.floor((distance % (1000*60*60))/(1000*60));
    let seconds: string|number = Math.floor((distance % (1000*60))/1000);
    
    hours 	= hours < 10 ? "0" + String(hours) : String(hours);
    minutes = minutes < 10 ? "0" + String(minutes) : String(minutes);
    seconds = seconds < 10 ? "0" + String(seconds) : String(seconds);

    $('#time-hour').text(hours);
    $('#time-min').text(minutes);
    $('#time-sec').text(seconds);

    if (hours === '00'
          && Number(minutes) < 5
          && !$('.bottom-timer').attr('class')?.includes('urgent')
      ) {
        $('.bottom-timer').addClass('urgent')
        $('.bottom-left-icon#clock').addClass('urgent')
      } else if (hours === '00'
          && Number(minutes) < 10
          && !$('.bottom-timer').attr('class')?.includes('warning')
      ) {
        $('.bottom-timer').addClass('warning')
      } 
    }, 1000)
    
  }

// ------------------------------------- 타이머 실행 --------------------------
dailyMissionTimer();
// ---------------------------------------- 소켓 ------------------------------------
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

socket.on('get top-left ranking', (data: RankingData[]) => {
  const rankingArray = data;
  console.log(rankingArray)    
  rankingArray.map((value, index) => {
    $(`.ranking-text-area-id#rank-${index}`).text(value.nickname)
    $(`.quantity#rank-${index}`).text(`${value.total}개`)
  })
});

// 우측 상단 응원 문구
socket.on('get right-top purchase message', (data: PurchaseMessage) => {
  const alarmType = data.icon;
  const { userId } = data;
  const { productName } = data;
  const { text } = data;
  const num = data.purchaseNum;

  console.log(data)
  // <img src="/public/images/${alarmType === '2' ? 'mars-2.gif' : 'mars-1.gif'}" id="donation-image"/>
  // <video src="/public/videos/${alarmType === '2' ? 'thanos.mp4' : 'thanos.mp4'}" class="donation-image" autoplay muted loop/>
  // <img src="/public/images/${alarmType === '2' ? 'donation-2.gif' : 'donation-1.gif'}" class="donation-image"/>
  messageHtml = `
  <div class="donation-wrapper">
    <iframe src="/public/audio/${alarmType === '2' ? 'alarm-type-2.mp3' : 'alarm-type-1.wav'}" id="iframeAudio" allow="autoplay" style="display:none"></iframe>
    <div class="item">
      <div class="centered">
      <img src="/public/images/${alarmType === '2' ? 'donation-2.gif' : 'donation-1.gif'}" class="donation-image"/>
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
  $('.ranking-area-inner').html(
    `
    <p class="ranking-text-area" id="rank-0">
      <span class="ranking-text-area-id">
      </span>
    </p>
    <p class="ranking-text-area" id="rank-1">
      <span class="ranking-text-area-id">
      </span>
    </p>
    <p class="ranking-text-area" id="rank-2">
      <span class="ranking-text-area-id">
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

socket.on('show virtual ad to client', async () => {
  $('.virtual-ad').html(
    `
    <img 
      src="/public/images/virtual-ad.gif"
      style="width:600px;height:300px;bottom:50px;right:50px;position:fixed;"
    />
    `
  ).show();
  await setTimeout(() => {
    $('.virtual-ad').empty();
  }, 10000);
});

socket.on('quantity object from server', (quantityObject:string) => {
  $('#quantity-object').text(quantityObject)
});

socket.on('get current quantity', (currentQuantity:number) => {
  $('#current-quantity').text(currentQuantity)
});

export { };
