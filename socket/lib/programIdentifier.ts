function identifier(): string {
  const navi = navigator.userAgent.toLowerCase();
  let program;

  // 엑스플릭 구분
  if (navi.indexOf('xsplit') !== -1) {
    program = 'xsplit';
    return program;
  }
  // 트위치 스튜디오 구분
  if (navi.indexOf('twitch') !== -1) {
    program = 'twitch-studio';
    return program;
  }
  // 프릭샷 구분
  if (navi.indexOf('wow') !== -1) {
    program = 'afreeca-freecshot';
    return program;
  }
  program = 'obs';
  return program;
}

export default identifier;
