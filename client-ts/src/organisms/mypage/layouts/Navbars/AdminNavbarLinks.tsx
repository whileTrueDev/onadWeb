import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// @material-ui/core components
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
// @material-ui/icons
import Notifications from '@material-ui/icons/Notifications';
import Person from '@material-ui/icons/Person';
import Home from '@material-ui/icons/Home';
import SpeakerNotes from '@material-ui/icons/SpeakerNotes';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
// core components
import NotificationPopper from './NotificationPopper';
// utils
import axios from '../../../../utils/axios';
import history from '../../../../history';
import HOST from '../../../../config';
import usePatchRequest from '../../../../utils/hooks/usePatchRequest';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import useAnchorEl from '../../../../utils/hooks/useAnchorEl';
// types
import { NoticeDataParam, NoticeDataRes } from './NotificationType';

function HeaderLinks(): JSX.Element {
  const userType = window.location.pathname.split('/')[2];

  // 개인 알림
  const notificationGet = useGetRequest<NoticeDataParam, NoticeDataRes>(`/${userType}/notification`);
  const {
    anchorEl, handleAnchorOpen, handleAnchorOpenWithRef, handleAnchorClose
  } = useAnchorEl();

  // 공지사항
  const noticeReadFlagGet = useGetRequest<{userType: string}, {noticeReadState: number}>(
    '/notice/read-flag', { userType }
  );
  const noticeReadFlagPatch = usePatchRequest('/notice/read-flag', () => {
    noticeReadFlagGet.doGetRequest();
  });

  // 로그아웃
  function handleLogoutClick(): void {
    axios.get(`${HOST}/logout`).then(() => { history.push('/'); });
  }

  const notificationRef = useRef<HTMLButtonElement | null>(null);
  // useEffect(() => {
  //   function handleUnreadNotificationOpen() {
  //     if (!notificationGet.loading
  //       && notificationGet.data
  //       && (notificationGet.data.notifications.filter((noti) => noti.readState === 0).length)) {
  //       handleAnchorOpenWithRef(notificationRef);
  //     }
  //   }
  //   handleUnreadNotificationOpen();
  // }, [handleAnchorOpenWithRef, notificationGet.data, notificationGet.loading]);

  return (
    <div>
      {/* notification */}
      <Tooltip title="알림">
        <IconButton
          aria-label="notifications"
          ref={notificationRef}
          onClick={(e): void => {
            if (anchorEl) { handleAnchorClose(); } else { handleAnchorOpen(e); }
          }}
        >
          <Badge
            badgeContent={!notificationGet.loading && notificationGet.data
              ? (notificationGet.data.notifications.filter((noti) => noti.readState === 0).length)
              : (null)}
            color="secondary"
          >
            <Notifications />
          </Badge>
        </IconButton>
      </Tooltip>

      {anchorEl && !notificationGet.loading && notificationGet.data && (
      <NotificationPopper
        anchorEl={anchorEl}
        notificationData={notificationGet.data.notifications}
        successCallback={notificationGet.doGetRequest}
      />
      )}

      <Hidden smDown>
        <Tooltip title="계정관리로 이동">
          <IconButton
            aria-label="User"
            to={window.location.pathname.includes('marketer')
              ? '/mypage/marketer/myoffice'
              : '/mypage/creator/user'}
            component={Link}
          >
            <Person />
          </IconButton>
        </Tooltip>
      </Hidden>

      <Hidden smDown>
        <Tooltip title="공지사항으로 이동">
          <IconButton
            aria-label="to-notice"
            to="/notice"
            component={Link}
            onClick={(): void => {
              if (!noticeReadFlagGet.loading && noticeReadFlagGet.data) {
                noticeReadFlagPatch.doPatchRequest({ userType });
              }
            }}
          >
            {!noticeReadFlagGet.loading
            && noticeReadFlagGet.data
            && noticeReadFlagGet.data.noticeReadState === 0 ? (
              <Badge variant="dot" color="primary">
                <SpeakerNotes />
              </Badge>
              ) : (
                <SpeakerNotes />
              )}
          </IconButton>
        </Tooltip>
      </Hidden>

      <Hidden smDown>
        <Tooltip title="홈으로 이동">
          <IconButton
            aria-label="to-home"
            to="/"
            component={Link}
          >
            <Home />
          </IconButton>
        </Tooltip>
      </Hidden>

      <Tooltip title="로그아웃">
        <IconButton
          onClick={handleLogoutClick}
          aria-label="logout"
        >
          <PowerSettingsNew />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default HeaderLinks;
