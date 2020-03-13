export interface NoticeDataParam {
  type: string;
}

export interface Notification {
  index: number;
  title: string;
  content: string;
  dateform: string;
  readState: number;
}

export interface NoticeDataRes {
  notifications: Notification[];
  unReadCount: number;
}
