
import { identifier } from './programIdentifier';
import { hiddenEventHandler } from './hiddenEventHandler';

const socket: any = io();
const programType: string = identifier();
const history: number = window.history.length;
const THIS_URL: string = window.location.href;
let bannerName: string | undefined = $('#banner-area').attr('name');
hiddenEventHandler(socket, THIS_URL, programType);
let socketHost: string = '';
console.log(document.visibilityState)
socket.emit('new client', [THIS_URL, history]);

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
  if ($('#imgMessage').find('#banner-area').length === 1) {
    $('#banner-area').fadeOut(1000, () => {
      $('#imgMessage').empty().append(`<img src="${msg[0]}" id="banner-area" name="${msg[1]}" width="100%" height="100%">`);
    }).fadeIn(1000);
  } else {
    $('#imgMessage').empty().append(`<img src="${msg[0]}" id="banner-area" name="${msg[1]}" width="100%" height="100%">`);
  }
});

socket.on('response banner data to server', () => {
  bannerName = $('#banner-area').attr('name');
  if (bannerName && document.visibilityState === 'visible') {
    const cutBannerName = bannerName.split(',');
    socket.emit('write to db', [cutBannerName, programType]);
  }
});

socket.on('re-render at client', () => {
  bannerName = $('#banner-area').attr('name');
  if (bannerName && document.visibilityState === 'visible') {
    socket.emit('re-render', [THIS_URL, bannerName]);
  }
});

socket.on('img clear', () => {
  $('#imgMessage').empty();
});

export { };
