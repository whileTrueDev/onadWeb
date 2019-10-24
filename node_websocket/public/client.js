/* eslint-env jquery */
$(() => {
  const socket = io();
  const history = window.history.length;
  const _url = window.location.href;
  const cutUrl = `/${_url.split('/')[4]}`;
  const navi = navigator.userAgent.toLowerCase();
  let program;
  let socketHost;
  let hidden;
  let visibilityChange;

  if (navi.indexOf('xsplit' !== -1)) {
    program = 'xsplit';
  } else { program = 'obs'; }

  if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  }

  function handleVisibilityChange() {
    if (document[hidden]) {
      socket.emit('pageActive handler', [cutUrl, 0, program]);
      $('#imgMessage').empty();
    } else {
      socket.emit('pageActive handler', [cutUrl, 1, program]);
      socket.emit('pageActive', _url);
    }
  }
  // Warn if the browser doesn't support addEventListener or the Page Visibility API
  if (typeof document.addEventListener === 'undefined' || typeof document[hidden] === 'undefined') {
    alert('change the browser');
  } else {
  // Handle page visibility change
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
  }

  socket.emit('new client', [_url, history]);

  socket.on('host pass', (SOCKET_HOST) => {
    socketHost = SOCKET_HOST;
  });

  socket.on('duplicate warn', (destination) => {
    window.location.href = destination;
  });

  socket.on('browser warning', (destination) => {
    window.location.href = destination;
  });

  socket.on('url warning', () => {
    window.location.href = `${socketHost}/wrongurl`;
  });

  socket.on('img receive', (msg) => {
    if ($('#imgMessage').find('#showBanner').length === 1) {
      $('#showBanner').fadeOut(1000, () => {
        $('#imgMessage').empty().append(`<img src= ${msg[0]} id='showBanner' name= ${msg[1]} width = '100%' height = '100%'>`);
      }).fadeIn(1000);
    } else {
      $('#imgMessage').empty().append(`<img src= ${msg[0]} id='showBanner' name= ${msg[1]} width = '100%' height = '100%'>`);
    }
  });

  socket.on('response banner data to server', () => {
    if ($('#showBanner').attr('name')) {
      const cutBannerName = $('#showBanner').attr('name').split(',');
      socket.emit('write to db', [cutBannerName, program]);
    }
  });

  socket.on('re-render at client', () => {
    const bannerName = $('#showBanner').attr('name');
    socket.emit('re-render', [_url, bannerName]);
  });

  socket.on('img clear', () => {
    $('#imgMessage').empty();
  });
});
