function identifier(): string {
  const navi = navigator.userAgent.toLowerCase();
  let program;

  if (navi.indexOf('xsplit') !== -1) {
    program = 'xsplit';
    return program;
  } if (navi.indexOf('twitch') !== -1) {
    program = 'twitch-studio';
    return program;
  }
  program = 'obs';
  return program;
}

export default identifier;
