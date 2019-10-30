const Axios = require('axios');

const url = 'https://hooks.slack.com/services/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';

/**
 * slack onad_alarm 채널에 메시지를 보내는 함수.
 * @param {string} text 보낼 메시지를 입력한다.
 * @param {string} type 보내는 서비스의 Docker container 이름.
 * - onad_landing_api
 * - onad_landing
 * - onad_web_api
 * - onad_web
 * - onad_socket
 * - onad_calculator
 */
function push(text, task, type = 'onad_web_api') {
  const sendingText = `[${type}]\n[${task} - ${new Date().toLocaleString()}]\n${text}`;
  Axios.post(url,
    JSON.stringify({
      text: sendingText
    }), { withCredentials: false });
}

module.exports = {
  push
};
