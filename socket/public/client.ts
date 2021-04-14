import identifier from './programIdentifier';
import hiddenEventHandler from './hiddenEventHandler';
import imageClicker from './imageClicker';

const socket: any = io({ transports: ['websocket'] });
const programType: string = identifier();
const history: number = window.history.length;
const THIS_URL: string = window.location.href;
let bannerName: string | undefined = $('.banner-area').attr('name');

function isVideo(src: string): boolean {
  const videoRegex = /.mp4/;
  return videoRegex.test(src);
}

hiddenEventHandler(socket, THIS_URL, programType);
imageClicker(socket, THIS_URL, programType);


setInterval(() => {
  $('.default').toggleClass('top');
  setTimeout(() => {
    $('.default.top').toggleClass('top');
  }, 10000);
}, 600000);


let socketHost = '';
socket.emit('new client', [THIS_URL, history, programType]);

socket.on('host pass', (SOCKET_HOST: string) => {
  socketHost = SOCKET_HOST;
});

socket.on('browser warning', (DESTINATION_URL: string) => {
  window.location.href = DESTINATION_URL;
});

socket.on('url warning', () => {
  window.location.href = `${socketHost}/wrongurl`;
});

socket.on('duplicate', (DESTINATION_URL: string) => {
  window.location.href = DESTINATION_URL;
});

socket.on('img receive', (msg: string[]) => {
  if ($('.img-area').find('.banner-area').length === 1 && isVideo(msg[0])) { // 기존 배너 있고 mp4일 때
    $('.banner-area').fadeOut(1000, () => {
      $('.img-area').empty().append(`
      <video class="banner-area" name="${msg[1]}" autoPlay loop muted width="100%" height="100%">
        <source src=${msg[0]} type="video/mp4" />
      </video>
      `);
      setTimeout(() => {
        $('.marquee').fadeOut(1000);
      }, 9000);
    }).fadeIn(1000);
  } else if ($('.img-area').find('.banner-area').length === 1 && isVideo(msg[0]) === false) { // 기존 배너 있고 이미지일 때
    $('.banner-area').fadeOut(1000, () => {
      $('.img-area').empty().append(`
      <img src=${msg[0]} class="banner-area" name="${msg[1]}" width="100%" height="100%">
      `);
      setTimeout(() => {
        $('.marquee').fadeOut(1000);
      }, 9000);
    }).fadeIn(1000);
  } else if (isVideo(msg[0])) { // 기존 배너없고 mp4일 때
    $('.img-area').empty().append(`
        <video class="banner-area" name="${msg[1]}" autoPlay loop muted width="100%" height="100%">
          <source type="video/mp4" src=${msg[0]} />
        </video>
        `);
    setTimeout(() => {
      $('.marquee').fadeOut(1000);
    }, 9000);
  } else { // 기존배너 없고 이미지일 때
    $('.img-area').empty().append(`<img src=${msg[0]} class="banner-area" name="${msg[1]}" width="100%" height="100%">`);
    setTimeout(() => {
      $('.marquee').fadeOut(1000);
    }, 9000);
  }
});

socket.on('re-render at client', () => {
  bannerName = $('.banner-area').attr('name');
  const hiddenState: boolean = $('div').hasClass('hidden');
  if (document.visibilityState === 'visible' && !hiddenState) {
    if (bannerName) {
      socket.emit('re-render', [THIS_URL, bannerName, programType]);
    } else {
      socket.emit('re-render', [THIS_URL, '', programType]);
    }
  }
});

socket.on('img clear', () => {
  $('.img-area').empty();
});


export { };
