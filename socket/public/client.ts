
import identifier from './programIdentifier';
import hiddenEventHandler from './hiddenEventHandler';

const socket: any = io();
const programType: string = identifier();
const history: number = window.history.length;
const THIS_URL: string = window.location.href;
let bannerName: string | undefined = $('#banner-area').attr('name');

function isVideo(src: string): boolean {
  const videoRegex = /video\/mp4/;
  return videoRegex.test(src);
}

hiddenEventHandler(socket, THIS_URL, programType);
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

socket.on('img receive', (msg: string[]) => {
  if ($('#imgMessage').find('#banner-area').length === 1 && isVideo(msg[0])) { // 기존 배너 있고 mp4일 때
    $('#banner-area').fadeOut(1000, () => {
      $('#imgMessage').empty().append(`
      <video id="banner-area" name="${msg[1]}" autoPlay loop muted width="100%" height="100%">
        <source src={${msg[0]}} type="video/mp4" />
      </video>
      `);
    }).fadeIn(1000);
  } else if ($('#imgMessage').find('#banner-area').length === 1 && isVideo(msg[0]) === false) { // 기존 배너 있고 이미지일 때
    $('#banner-area').fadeOut(1000, () => {
      $('#imgMessage').empty().append(`<img src="${msg[0]}" id="banner-area" name="${msg[1]}" width="100%" height="100%">`);
    }).fadeIn(1000);
  } else if (isVideo(msg[0])) { // 기존 배너없고 mp4일 때
    $('#imgMessage').empty().append(`
        <video id="banner-area" name="${msg[1]}" autoPlay loop muted width="100%" height="100%">
          <source type="video/mp4" src=${msg[0]} />
        </video>
        `);
  } else { // 기존배너 없고 이미지일 때
    $('#imgMessage').empty().append(`<img src="${msg[0]}" id="banner-area" name="${msg[1]}" width="100%" height="100%">`);
  }
});

socket.on('re-render at client', () => {
  bannerName = $('#banner-area').attr('name');
  if (bannerName && document.visibilityState === 'visible') {
    socket.emit('re-render', [THIS_URL, bannerName, programType]);
  }
});

socket.on('img clear', () => {
  $('#imgMessage').empty();
});

export { };
