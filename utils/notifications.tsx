import { notifications as _notifications } from '@mantine/notifications';

type CustomNotificationProps = Omit<Parameters<typeof _notifications.show>[0], 'id'> & {
  type?: 'success' | 'error' | 'info' | 'warning';
};

const NOTIFICATION_COLORS = {
  success: 'green',
  error: 'red',
  info: 'blue',
  warning: 'yellow',
};
export const notifications = {
  ..._notifications,
  show: ({ type, ...defaultNotificationProps }: CustomNotificationProps, store?: Parameters<typeof _notifications.show>[1]) => {
    _notifications.show({ ...defaultNotificationProps, color: NOTIFICATION_COLORS[type || 'info'] }, store);
  }
}