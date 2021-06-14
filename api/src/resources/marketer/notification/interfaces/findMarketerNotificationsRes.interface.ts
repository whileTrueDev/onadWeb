import { MarketerNotification } from '../../../../entities/MarketerNotification';

export interface FindMarketerNotificationsRes {
  notifications: MarketerNotification[];
  unReadCount: number;
}
