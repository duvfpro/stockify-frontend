import { Button, notification } from 'antd';

const NotificationButton = () => {
  const openNotification = () => {
    notification.open({
      message: 'Notifications',
      description: 'Kevin est en rupture de glace',
      className: 'custom-class',
      style: {
        width: 600,
      },
    });
  };

  return (
    <Button type="primary" onClick={openNotification}>
      Notifications
    </Button>
  );
};

export default NotificationButton;
