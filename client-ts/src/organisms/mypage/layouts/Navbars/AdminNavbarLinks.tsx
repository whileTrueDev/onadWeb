import React, { useEffect, useRef } from 'react';
// @material-ui/core components
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
// @material-ui/icons
import Notifications from '@material-ui/icons/Notifications';
// core components
import { Avatar } from '@material-ui/core';
import NotificationPopper from './sub/NotificationPopper';
// utils
import axios from '../../../../utils/axios';
import history from '../../../../history';
import HOST from '../../../../config';
import usePatchRequest from '../../../../utils/hooks/usePatchRequest';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import useAnchorEl from '../../../../utils/hooks/useAnchorEl';
// types
import { NoticeDataParam, NoticeDataRes } from './NotificationType';
import UserPopover from './sub/UserPopover';

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

  // ------ For 읽지않은 알림 존재 시 알림 컴포넌트 열어두기 ------
  const [isAlreadyRendered, setIsAlreadyRendered] = React.useState(false);
  const notificationRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    function handleUnreadNotificationOpen(): void {
      if (!notificationGet.loading && notificationGet.data
        && (notificationGet.data.notifications.filter((noti) => noti.readState === 0).length)
        && !isAlreadyRendered) {
        setIsAlreadyRendered(true);
        handleAnchorOpenWithRef(notificationRef);
      }
    }
    handleUnreadNotificationOpen();
  }, [handleAnchorOpenWithRef, isAlreadyRendered, notificationGet.data, notificationGet.loading]);
  // ------ For 읽지않은 알림 존재 시 알림 컴포넌트 열어두기 ------


  // 유저 로고 클릭시의 설정 리스트
  const userLogoAnchor = useAnchorEl();
  // anchorEl, handleAnchorOpen, handleAnchorOpenWithRef, handleAnchorClose


  return (
    <div>

      {/* notification */}
      <Tooltip title="알림">
        <IconButton
          size="medium"
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
            <Notifications fontSize="default" />
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton size="small" onClick={userLogoAnchor.handleAnchorOpen}>
        <Avatar />
      </IconButton>


      {/* 알림 popover 모바일 크기 최적화 필요 */}
      {anchorEl && !notificationGet.loading && notificationGet.data && (
        <NotificationPopper
          anchorEl={anchorEl}
          handleAnchorClose={handleAnchorClose}
          notificationData={notificationGet.data.notifications}
          successCallback={notificationGet.doGetRequest}
        />
      )}

      {/* 유저 설정 리스트 */}
      <UserPopover
        open={userLogoAnchor.open}
        anchorEl={userLogoAnchor.anchorEl}
        handleAnchorClose={userLogoAnchor.handleAnchorClose}
        handleLogoutClick={handleLogoutClick}
        noticeReadFlagGet={noticeReadFlagGet}
        doNoticePatchRequest={() => {
          noticeReadFlagPatch.doPatchRequest({ userType });
        }}
      />
    </div>
  );
}

export default HeaderLinks;
