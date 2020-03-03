import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Typography, Divider, Badge, Popper
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import useUpdateData from '../../utils/lib/hooks/useUpdateData';
import useTSPatchData from '../../utils/lib/hooks/useTSPatchData';


const useStyles = makeStyles(() => ({
  contents: {
    width: 420,
    maxHeight: 540,
    zIndex: '1300',
    opacity: 1,
    backgroundColor: 'white',
    boxShadow: '1px 1px 1px 1px gray',
    overflowX: 'hidden',
    overflowY: 'auto'
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
  const userType = window.location.pathname.split('/')[2];
  const classes = useStyles();
  const {
    anchorEl, notificationData
  } = props;
  // const updateRequest = useUpdateData(`/api/dashboard/${userType}/notification/update/read`);
  const updateRequest = useTSPatchData(`/marketer/notification`);

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
    <Popper
      placement="top-end"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      disablePortal
      modifiers={{
        flip: {
          enabled: true,
        },
        preventOverflow: {
          enabled: false,
          boundariesElement: 'scrollParent',
        }
      }}
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
    </Popper>
  );
}

Notification.propTypes = {
  anchorEl: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  notificationData: PropTypes.object.isRequired,
};

Notification.defaultProps = {
  anchorEl: '',
};

export default Notification;
