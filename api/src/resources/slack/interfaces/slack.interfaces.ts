interface SlackMessageField {
  title: string;
  value: string;
  short: boolean;
}
export interface SlackMessageData {
  summary: string;
  linkTitle?: string;
  linkUrl?: string;
  text: string;
  fields: SlackMessageField[];
  footer?: string;
  footerIcon?: string;
}
