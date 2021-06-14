export interface FindNotificationsRes {
  notifications: {
    index: number;
    title: string;
    content: string;
    readState: number;
    dateform: string;
  }[];
  unreadCount: number;
}
