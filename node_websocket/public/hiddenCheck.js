module.exports = $((socketParam) => {
  const socket = socketParam;

  function getHiddenProp() {
    const prefixes = ['webkit', 'moz', 'ms', 'o'];

    // test for native support
    if ('hidden' in document) return 'hidden';

    // find prefixes
    for (let i = 0; i < prefixes.length; i++) {
      if ((`${prefixes[i]}Hidden`) in document) { return `${prefixes[i]}Hidden`; }
    }

    // otherwise it's not supported
    return null;
  }

  const visProp = getHiddenProp();
  if (visProp) {
    const evtname = `${visProp.replace(/[H|h]idden/, '')}visibilitychange`;
    document.addEventListener(evtname, changeEventListener, false);
  } else {
    console.log('Page Visibility API doesnt support !');
  }

  function changeEventListener() {
    if (!document[visProp]) {
      socket.emit('pageActive', () => {
        console.log('page active');
      });
    } else {
      socket.emit('pageInactive', () => {
        console.log('pageInactive');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#page').innerHTML = `Page is visible -${new Date()}<br>`;
  }, false);
});
