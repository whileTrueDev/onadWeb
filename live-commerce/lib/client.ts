import { ImageData, RankingData } from '../@types/data';

const socket: any = io({ transports: ['websocket'] });
let bottomMessages: Array<null | string> = [];
const THIS_URL: string = window.location.href;

let startDate = new Date('2021-09-25T22:00:00+0900');
let setDate = new Date('2021-09-25T23:30:00+0900');

let messageHtml: string;
const messageArray: any[] = [];
const topMessages: any[] = [];
let bannerId = 0;
let bottomTextIndex = 0;

async function switchBottomText() {
  if (bottomTextIndex >= bottomMessages.length) {
    bottomTextIndex = 0;
  }
  if (bottomMessages.length !== 0) {
    await setTimeout(() => {
      $('.bottom-area-text').text(`${bottomMessages[bottomTextIndex]}`).fadeIn(500);
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
      // $('.top-right').append(messageArray[0].alarmSoundTag);
      const sound = new Audio(messageArray[0].audioBlob);
      sound.play();
      messageArray.splice(0, 1);
    }, 3000);
    await setTimeout(() => {
      $('.top-right').fadeOut(800);
      $('.donation-image').attr('src', '/public/images/invisible.png');
    }, 10000);
  }
}, 2000);
// 비회원 메세지
setInterval(async () => {
  if (topMessages.length !== 0 && $('.top-wrapper').css('display') === 'none') {
    $('.top-wrapper').css({ display: 'flex' });
    $('.top-wrapper').html(topMessages[0].messageHtml);
    topMessages.splice(0, 1);
    await setTimeout(() => {
      $('.top-wrapper').fadeOut(800);
    }, 5000);
  }
}, 2000);
// 세로배너
async function switchImage() {
  if (!$('.vertical-banner').attr('src')?.includes('gif')) {
    bannerId += 1;
    if (bannerId === 13) {
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
    
    const extraTimeToStart = startDate.getTime() - now.getTime();

    const extraHoursToStart: string | number = Math.floor((extraTimeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const extraMinutesToStart: string | number = Math.floor((extraTimeToStart % (1000 * 60 * 60)) / (1000 * 60));
    const extraSecondsToStart = Math.floor((extraTimeToStart % (1000 * 60)) / 1000);
    if (extraHoursToStart === 0 && extraMinutesToStart === 0){
    if (extraSecondsToStart === 11) {
      const roomName = THIS_URL.split('/').pop();
      socket.emit('send notification signal', roomName)
      } else if (extraSecondsToStart === 5) {
        //5sec-timer.MP3
        $('body').append(`
        <iframe src="/public/audio/5sec-timer.MP3" id="sec-timer" allow="autoplay" style="display:none"></iframe>
        `)
      }
      else if (extraSecondsToStart === 0) {
        $('body').remove('#sec-timer')
        const introHtml = `
          <video class="inner-video-area" autoplay>
            <source src="/public/videos/intro.mp4" type="video/mp4">
          </video>
            `;
          $('.full-video').html(introHtml);
      }
}
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
      $(`.quantity#rank-${index}`).text(
        `${value.total.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}원`,
      );
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
      $(`.quantity#rank-${index}`).text(
        `${value.total.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}원`,
      );
    });
  }
});

socket.on('toggle right-top onad logo from server', () => {
  if ($('#onad-logo').attr('src')?.includes('-')) {
    $('#onad-logo').attr('src', '/public/images/onadLogo.png');
  } else {
    $('#onad-logo').attr('src', '/public/images/onadLogo-gray.png');
  }
});

// 우측 상단 응원 문구
socket.on('get right-top purchase message', async (data: any) => {
  const alarmType = data[0].icon;
  const { userId } = data[0];
  const { productName } = data[0];
  const { text } = data[0];
  const num = data[0].purchaseNum;
  let audioBlob;

  if (data) {
    const blob = new Blob([data[1]], { type: 'audio/mp3' });
    audioBlob = window.URL.createObjectURL(blob);
  }

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
            <span class="donation-sub">원 구매!</span>
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
  messageArray.push({ audioBlob, messageHtml });
});

socket.on('get top purchase message', async (data: any) => {
  const { userId } = data;
  const { productName } = data;
  const price = data.purchaseNum;

  messageHtml = `
  <div class="donation-wrapper">
    <iframe src="/public/audio/alarm-type-1.wav"
    id="iframeAudio" allow="autoplay" style="display:none"></iframe>
    <div class="centered">
      <div class ="animated heartbeat" id="donation-top">
        <span id="nickname">
          <span class="animated heartbeat" id="donation-user-id">${userId}</span>
          <span class="donation-sub">님 ${productName}</span>
          <span class="animated heartbeat" id="donation-num">${price
            .toString()
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}</span>
          <span class="donation-sub">원 구매 감사합니다!</span>
        </span>
      </div>
    </div>
  </div>
  
  `;
  topMessages.push({ messageHtml });
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
  $('.bottom-area-text').css({ opacity: 0 });
  $('.bottom-area-right')
    .prepend(
      `
    <p class="bottom-admin">
      ${data}
    </p>
  `,
    )
    .fadeIn(1000);
  setTimeout(() => {
    $('.bottom-admin').remove();
    $('.bottom-area-text').css({ opacity: 1 });
  }, 10000);
});

// 응원메세지 marquee
socket.on('get bottom purchase message', (data: string[]) => {
  bottomMessages = data;
});

// 하단 비우기
socket.on('clear bottom area to client', () => {
  $('.bottom-area-right').css({ opacity: 0 });
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
});

// 하단 다시 띄우기
socket.on('show bottom area to client', () => {
  $('.bottom-area-right').css({ opacity: 1 }).fadeIn(2000);
});

socket.on('show screen', () => {
  // $(document.body).fadeIn(1000);
  $('.live-commerce').fadeIn(500)
});

socket.on('clear screen', () => {
  // $(document.body).fadeOut(1000);
  $('.live-commerce').fadeOut(500)
});

socket.on('quantity object from server', (quantityObject: string) => {
  $('#quantity-object').text(quantityObject);
  $('.bottom-object').css({
    opacity: 1,
  });
});

socket.on('d-day from server', (date: string) => {
  setDate = new Date(date);
});

socket.on('refresh signal', () => {
  location.reload();
});

socket.on('show video from server', (type: string) => {
  if (type === 'intro') {
    const introHtml = `
    <video class="inner-video-area" autoplay>
      <source src="/public/videos/intro.mp4" type="video/mp4">
    </video>
      `;
    $('.full-video').html(introHtml);
  } else {
    const outroHtml = `
    <video class="inner-video-area" autoplay>
      <source src="/public/videos/outro.mp4" type="video/mp4">
    </video>
      `;
    $('.full-video').html(outroHtml);
  }
});

socket.on('clear full video from server', () => {
  $('.inner-video-area').fadeOut(800);
});

socket.on('get start time from server', (timeData:string) => {
  startDate = new Date(timeData);
})

socket.on('get objective message', async (objective:number) => {
  messageHtml = `
  <div class="donation-wrapper">
    <iframe src="/public/audio/alarm-type-2.wav"
    id="iframeAudio" allow="autoplay" style="display:none"></iframe>
    <div class="centered">
      <div class ="animated heartbeat" id="donation-top">
        <span id="nickname">
          <span class="donation-sub">판매금액</span>
          <span class="animated heartbeat" id="donation-num">${objective
            .toString()
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}</span>
          <span class="donation-sub">원 돌파!!!</span>
        </span>
      </div>
    </div>
  </div>

  `;
  topMessages.push({ messageHtml });
});

socket.once('get stream start notification tts', (audioBuffer:Buffer) => {
  if (audioBuffer){
    const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
    const streamStartNotificationAudioBlob = window.URL.createObjectURL(blob);
    const sound = new Audio(streamStartNotificationAudioBlob);
    setTimeout(() => {
      sound.play();
    }, 1000)
}})

socket.on('connection check from server', () => {
  $('.on-air').toggle()
})
export {};
