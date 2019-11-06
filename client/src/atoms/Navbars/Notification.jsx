import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Typography, Divider, Badge
} from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import useUpdateData from '../../utils/lib/hooks/useUpdateData';

const useStyles = makeStyles(() => ({
  contents: {
    width: 420, maxHeight: 540
  },
  title: {
    padding: 8, display: 'flex', justifyContent: 'space-between'
  },
  message: {
    marginTop: 4, marginBottom: 4
  },
  grey: {
    color: '#90909090'
  }
}));

const UNREAD_STATE = 0; // 읽지않음 상태값

function Notification(props) {
  const classes = useStyles();
  const {
    anchorEl, handleMenuClose, notificationData,
  } = props;

  const userType = window.location.pathname.split('/')[2];
  const updateRequest = useUpdateData(`/api/dashboard/${userType}/notification/update/read`);

  function updateNotifications(notiArray, targetIndex) {
    const arr = notiArray;
    arr.forEach((noti, idx) => {
      if (noti.index === targetIndex) {
        arr[idx] = { ...noti, readState: 1 };
      }
    });
    return arr;
  }

  return (
    <Menu
      elevation={0}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id="notification-menu"
      keepMounted
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      {/* 공지 메뉴 컴포넌트 */}
      <div className={classes.contents}>
        <div className={classes.title}>
          <Typography variant="h5">알림</Typography>
          <Typography
            className={classes.grey}
            align="right"
            gutterBottom
            variant="caption"
          >
            클릭시 읽음처리됩니다.
          </Typography>
        </div>
        <Divider />

        { !notificationData.loading && !notificationData.error && (
        <div>
          {notificationData.payload.notifications.map(noti => (
            <div key={noti.index}>
              <MenuItem onClick={() => {
                updateRequest.handleUpdateRequest({ index: noti.index });
                if (noti.readState === UNREAD_STATE) {
                  notificationData.setPayload({
                    notifications: [
                      ...updateNotifications(notificationData.payload.notifications, noti.index)
                    ],
                    unReadCount: notificationData.payload.unReadCount - 1
                  });
                }
              }}
              >
                <div className={classes.message}>
                  <Typography>
                    {noti.readState
                      ? (<Badge variant="dot" color="default"><span /></Badge>)
                      : (<Badge variant="dot" color="secondary"><span /></Badge>)}
                  </Typography>
                  <Typography variant="body1" gutterBottom noWrap>
                    {noti.title}
                  </Typography>
                  <Typography variant="body2" gutterBottom noWrap>
                    <span style={{ whiteSpace: 'pre-line' }}>
                      {noti.content}
                    </span>
                  </Typography>
                  <Typography variant="caption" gutterBottom noWrap>
                    <span>{`${noti.dateform} / ONAD`}</span>
                  </Typography>
                </div>
              </MenuItem>
              <Divider />
            </div>
          ))}
        </div>
        )}
      </div>


    </Menu>
  );
}

Notification.propTypes = {
  anchorEl: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  handleMenuClose: PropTypes.func.isRequired,
  notificationData: PropTypes.object.isRequired,
};

Notification.defaultProps = {
  anchorEl: '',
};

export default Notification;
