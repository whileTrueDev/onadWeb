import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Typography, Divider, Badge, Popover, List, ListItem,
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import usePatchRequest from '../../../../../utils/hooks/usePatchRequest';
// types
import { Notification } from '../NotificationType';

const useStyles = makeStyles((theme: Theme) => ({
  contents: {
    color: theme.palette.text.primary,
    minWidth: 320,
    maxWidth: 400,
    minHeight: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  title: {
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    marginTop: 4, marginBottom: 4
  },
}));

const UNREAD_STATE = 0; // 읽지않음 상태값

export default function NotificationPopover({
  anchorEl,
  notificationData,
  successCallback,
  handleAnchorClose
}: {
  anchorEl: HTMLElement;
  notificationData: Notification[];
  successCallback: () => void;
  handleAnchorClose: () => void;
}): JSX.Element {
  const userType = window.location.pathname.split('/')[2];
  const classes = useStyles();
  const notiReadPatch = usePatchRequest(`/${userType}/notification`, () => {
    // 클라이언트 알림 읽음 처리
    successCallback(); // 개인 알림 데이터 리로드
  });
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleAnchorClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      disableScrollLock
      style={{ maxHeight: 600 }}
    >
      {/* 공지 메뉴 컴포넌트 */}
      <List className={classes.contents}>
        <ListItem style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">알림</Typography>
          <Typography variant="caption" align="right">클릭시 읽음처리됩니다.</Typography>
        </ListItem>
        <Divider />
        <div>
          {notificationData.map((noti) => (
            <div key={noti.index}>
              <MenuItem onClick={(): void => {
                if (noti.readState === UNREAD_STATE) {
                  notiReadPatch.doPatchRequest({ index: noti.index });
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

      </List>
    </Popover>
  );
}
