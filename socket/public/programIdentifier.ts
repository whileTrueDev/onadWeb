function identifier(): any {
  const navi = navigator.userAgent.toLowerCase();
  let program;

  if (navi.indexOf('xsplit') !== -1) {
    program = 'xsplit';
    return program;
  } else if (navi.indexOf('twitch') !== -1) {
    program = 'twitch-studio';
    return program;
  } else {
    program = 'obs';
    return program;
  }
}
export { identifier };