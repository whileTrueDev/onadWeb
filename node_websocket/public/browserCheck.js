// 익스플로러 체크
var agent = navigator.userAgent.toLowerCase();
if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
  document.write("인터넷 익스플로러 브라우저 입니다.");
}
else {
  document.write("인터넷 익스플로러 브라우저가 아닙니다.");
}

// 크롬 체크
var agent = navigator.userAgent.toLowerCase();
if (agent.indexOf("chrome") != -1) {
  document.write("크롬 브라우저입니다.");
}
// 사파리나 체크
var agent = navigator.userAgent.toLowerCase();
if (agent.indexOf("safari") != -1) {
  document.write("사파리 브라우저입니다.");
}
// 파이어폭스 체크
var agent = navigator.userAgent.toLowerCase();
if (agent.indexOf("firefox") != -1) {
  document.write("파이어폭스 브라우저입니다.");
}