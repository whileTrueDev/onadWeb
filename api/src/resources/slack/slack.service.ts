import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SlackMessageData } from './interfaces/slack.interfaces';

@Injectable()
export class SlackService {
  private SLACK_URL: string;
  constructor(private readonly configService: ConfigService) {
    this.SLACK_URL = configService.get<string>('SLACK_ALARM_URL');
  }

  public jsonMessage({
    summary,
    linkTitle = '관리자 페이지 바로가기',
    linkUrl = 'https://admin.onad.io',
    text,
    fields,
    footer = 'OnAD Slack Bot',
    footerIcon = 'https://platform.slack-edge.com/img/default_application_icon.png',
  }: SlackMessageData): Promise<string | number> {
    return axios
      .post(
        this.SLACK_URL,
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
            },
          ],
        }),
        { withCredentials: true },
      )
      .then(res => res.status)
      .catch((err: any) => {
        const { status, statusText } = err.response;
        console.log(status, statusText, 'ERR in Slack alarm to onad_alarm, check slack webhook');
        return 'slack messaging fail';
      });
  }
}
