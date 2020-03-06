import Axios from 'axios';

const url = process.env.SLACK_ALARM_URL as string;

/**
 * slack onad_alarm 채널에 메시지를 보내는 함수.
 * @param {string} text text: 보낼 메시지
 * @param {string} task task: 작업을 명시
 * @param {string} type 보내는 서비스의 Docker container 이름.
 * - onad_landing_api
 * - onad_landing
 * - onad_web_api
 * - onad_web
 * - onad_socket
 * - onad_calculator
 */
function push(text: string, task: string, type = 'onad_web_api') {
  const sendingText = `[${type}]\n[${`${task} - ` || ''}${new Date().toLocaleString()}]\n${text}`;
  Axios.post(url,
    JSON.stringify({
      text: sendingText
    }), { withCredentials: true })
    .catch((err: any) => {
      const { status, statusText } = err.response;
      console.log(status, statusText, 'ERR in Slack alarm to onad_alarm, check slack webhook');
    });
}

export default push