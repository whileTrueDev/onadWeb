import { useState, useContext, useEffect, useRef } from 'react';
// @material-ui/core components
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
// @material-ui/icons
import Notifications from '@material-ui/icons/Notifications';
// core components
import { Avatar, makeStyles } from '@material-ui/core';
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
import MarketerPopover from './sub/MarketerPopover';
import { MarketerInfo } from '../../marketer/office/interface';
import MarketerInfoContext from '../../../../context/MarketerInfo.context';
import { ContractionDataType } from '../../creator/shared/StartGuideCard';
import { useMypageStore } from '../../../../store/mypageStore';

const useStyles = makeStyles(theme => ({
  avatar: { width: theme.spacing(4), height: theme.spacing(4) },
}));

export interface AdminNavbarLinksProps {
  type: 'marketer' | 'creator';
}
export default function AdminNavbarLinks({ type }: AdminNavbarLinksProps): JSX.Element {
  const classes = useStyles();

  // 개인 알림
  const notificationGet = useGetRequest<NoticeDataParam, NoticeDataRes>(`/${type}/notification`);
  const handleNotiOpen = useMypageStore(state => state.handleNotiOpen);

  // 공지사항
  const noticeReadFlagGet = useGetRequest<any, { noticeReadState: number }>('/notice/read-flag', {
    userType: type,
  });
  const noticeReadFlagPatch = usePatchRequest('/notice/read-flag', () => {
    noticeReadFlagGet.doGetRequest();
  });

  // 로그아웃
  function handleLogoutClick(): void {
    axios.get(`${HOST}/logout`).then(() => {
      history.push('/');
    });
  }

  // 유저 로고 클릭시의 설정 리스트
  const handleUserMenuOpen = useMypageStore(state => state.handleUserMenuOpen);
  // 유저 정보 조회
  const userProfileGet = useGetRequest<null, ContractionDataType & MarketerInfo>(`/${type}`);
  // ***************************************************
  // 프로필 사진 변경 시, 마이페이지 네비바에서 유저 정보 다시 조회하기 위한 컨텍스트 사용
  const marketerInfo = useContext(MarketerInfoContext);

  return (
    <div>
      {/* notification */}
      <Tooltip title="알림">
        <IconButton size="medium" aria-label="notifications" onClick={e => handleNotiOpen(e)}>
          <Badge
            badgeContent={
              !notificationGet.loading && notificationGet.data
                ? notificationGet.data.notifications.filter(noti => noti.readState === 0).length
                : null
            }
            color="secondary"
          >
            <Notifications fontSize="default" />
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton size="small" onClick={handleUserMenuOpen}>
        {/* 읽지않은 공지사항이 있는 경우 뱃지 표시 */}
        {!noticeReadFlagGet.loading &&
        noticeReadFlagGet.data &&
        noticeReadFlagGet.data.noticeReadState === 0 ? (
          <Badge variant="dot" color="secondary">
            <div>
              {type === 'creator' && (
                <Avatar
                  className={classes.avatar}
                  src={
                    userProfileGet.data
                      ? userProfileGet.data.creatorLogo || userProfileGet.data.afreecaLogo
                      : ''
                  }
                />
              )}
              {type === 'marketer' && (
                <Avatar
                  className={classes.avatar}
                  src={marketerInfo.user ? marketerInfo.user.profileImage : ''}
                />
              )}
            </div>
          </Badge>
        ) : (
          <div>
            {/* 읽지않은 공지사항이 없는 경우 */}
            {type === 'creator' && (
              <Avatar
                className={classes.avatar}
                src={
                  userProfileGet.data
                    ? userProfileGet.data.creatorLogo || userProfileGet.data.afreecaLogo
                    : ''
                }
              />
            )}
            {type === 'marketer' && (
              <Avatar
                className={classes.avatar}
                src={marketerInfo.user ? marketerInfo.user.profileImage : ''}
              />
            )}
          </div>
        )}
      </IconButton>

      {/* 알림 popover 모바일 크기 최적화 필요 */}
      {!notificationGet.loading && notificationGet.data && (
        <NotificationPopper
          notificationData={notificationGet.data.notifications}
          successCallback={notificationGet.doGetRequest}
        />
      )}

      {/* 유저 설정 리스트 */}
      {type === 'creator' && !userProfileGet.loading && userProfileGet.data && (
        <UserPopover
          userData={userProfileGet.data}
          handleLogoutClick={handleLogoutClick}
          noticeReadFlagGet={noticeReadFlagGet}
          doNoticePatchRequest={(): void => {
            noticeReadFlagPatch.doPatchRequest({ type });
          }}
        />
      )}

      {/* 유저 설정 리스트 */}
      {type === 'marketer' && !marketerInfo.loading && marketerInfo.user && (
        <MarketerPopover
          userData={marketerInfo.user}
          handleLogoutClick={handleLogoutClick}
          noticeReadFlagGet={noticeReadFlagGet}
          doNoticePatchRequest={(): void => {
            noticeReadFlagPatch.doPatchRequest({ type });
          }}
        />
      )}
    </div>
  );
}
