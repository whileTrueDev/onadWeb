/**
 * @name 배너URL생성함수
 */
const makeAdvertiseUrl = (): string => {
  let password = '';
  for (let i = 0; i < 8; i += 1) {
    const lowerStr = String.fromCharCode(Math.floor(Math.random() * 26 + 97));
    if (i % 2 === 0) {
      password += String(Math.floor(Math.random() * 10));
    } else {
      password += lowerStr;
    }
  }
  return `/${password}`;
};
export default makeAdvertiseUrl;
