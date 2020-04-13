import Axios from 'axios';

interface SlackMessageField {
  title: string; value: string; short: boolean;
}
export interface SlackMessageData {
  summary: string; linkTitle?: string; linkUrl?: string;
  text: string; fields: SlackMessageField[];
  footer?: string; footerIcon?: string;
}
const url = process.env.SLACK_ALARM_URL as string;
export default function messageWithJson({
  summary,
  linkTitle = '관리자 페이지 바로가기',
  linkUrl = 'http://localhost:3051',
  text, fields,
  footer = 'OnAD Slack Bot',
  footerIcon = 'https://platform.slack-edge.com/img/default_application_icon.png'
}: SlackMessageData): void {
  Axios
    .post(url,
      JSON.stringify({
        attachments: [
          {
            fallback: summary,
            pretext: summary,
            color: '#3AA3E3',
            title: linkTitle,
            title_link: linkUrl,
            text,
            fields,
            footer,
            footerIcon,
          }
        ]
      }), { withCredentials: true })
    .catch((err: any) => {
      const { status, statusText } = err.response;
      console.log(status, statusText, 'ERR in Slack alarm to onad_alarm, check slack webhook');
    });
}
