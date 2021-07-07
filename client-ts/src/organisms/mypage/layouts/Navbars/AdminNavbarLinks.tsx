// core components
import { Avatar, Hidden, makeStyles } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
// @material-ui/core components
import Tooltip from '@material-ui/core/Tooltip';
// @material-ui/icons
import Notifications from '@material-ui/icons/Notifications';
import { useContext } from 'react';
import { useQueryClient } from 'react-query';
import MarketerInfoContext from '../../../../context/MarketerInfo.context';
import history from '../../../../history';
import { useMypageStore } from '../../../../store/mypageStore';
import { useLogoutMutation } from '../../../../utils/hooks/mutation/useLogoutMutation';
import { CreatorProfile } from '../../../../utils/hooks/query/useCreatorProfile';
import { useNoticeReadFlag } from '../../../../utils/hooks/query/useNoticeReadFlag';
import { useNotifications } from '../../../../utils/hooks/query/useNotifications';
import { useProfileByUserType } from '../../../../utils/hooks/query/useProfileByUserType';
import useAnchorEl from '../../../../utils/hooks/useAnchorEl';
import usePatchRequest from '../../../../utils/hooks/usePatchRequest';
// types
import MarketerPopover from './sub/MarketerPopover';
import NotificationPopper from './sub/NotificationPopper';
import UserPopover from './sub/UserPopover';

const useStyles = makeStyles(theme => ({
  avatar: { width: theme.spacing(4), height: theme.spacing(4) },
}));

export interface AdminNavbarLinksProps {
  type: 'marketer' | 'creator';
}
export default function AdminNavbarLinks({ type }: AdminNavbarLinksProps): JSX.Element {
  const queryClient = useQueryClient();
  const classes = useStyles();

  // 개인 알림
  const { anchorEl, handleAnchorOpen, handleAnchorClose } = useAnchorEl();
  const notificationGet = useNotifications(type);
  // 개인알림 읽음 렌더링 처리
  function onNotificationUpdate(updatedId: number): void {
    if (notificationGet.data) {
      const targetIdx = notificationGet.data.notifications.findIndex(x => x.index === updatedId);
      const newNotis = notificationGet.data.notifications;
      newNotis[targetIdx] = {
        ...newNotis[targetIdx],
        readState: 1,
      };
      queryClient.setQueryData(['notifications', type], {
        unReadCount: notificationGet.data.unReadCount - 1,
        notifications: newNotis,
      });
    }
  }

  // 공지사항
  const noticeReadFlag = useNoticeReadFlag(type);
  const noticeReadFlagPatch = usePatchRequest('/notice/read-flag', () => {
    queryClient.invalidateQueries(['noticeReadFlag', type]);
  });

  // 로그아웃
  const logoutMutation = useLogoutMutation();
  function handleLogoutClick(): void {
    logoutMutation.mutate();
    history.push('/');
  }

  // 유저 로고 클릭시의 설정 리스트
  const handleUserMenuOpen = useMypageStore(x => x.handleUserMenuOpen);

  // 유저 정보 조회
  const userProfile = useProfileByUserType(type);

  // ***************************************************
  // 프로필 사진 변경 시, 마이페이지 네비바에서 유저 정보 다시 조회하기 위한 컨텍스트 사용
  const marketerInfo = useContext(MarketerInfoContext);

  return (
    <div>
      {/* notification */}
      <Hidden xsDown>
        <Tooltip title="알림">
          <IconButton
            size="medium"
            aria-label="notifications"
            onClick={(e): void => {
              if (anchorEl) {
                handleAnchorClose();
              } else {
                handleAnchorOpen(e);
              }
            }}
          >
            <Badge
              badgeContent={
                !notificationGet.isLoading && notificationGet.data
                  ? notificationGet.data.notifications.filter(noti => noti.readState === 0).length
                  : null
              }
              color="secondary"
            >
              <Notifications fontSize="default" />
            </Badge>
          </IconButton>
        </Tooltip>
      </Hidden>

      <IconButton size="small" onClick={handleUserMenuOpen}>
        {/* 읽지않은 공지사항이 있는 경우 뱃지 표시 */}
        {!noticeReadFlag.isLoading &&
        noticeReadFlag.data &&
        noticeReadFlag.data.noticeReadState === 0 ? (
          <Badge variant="dot" color="secondary">
            <div>
              {type === 'creator' && (
                <Avatar
                  className={classes.avatar}
                  src={
                    userProfile.data
                      ? (userProfile.data as CreatorProfile).creatorLogo ||
                        (userProfile.data as CreatorProfile).afreecaLogo
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
                  userProfile.data
                    ? (userProfile.data as CreatorProfile).creatorLogo ||
                      (userProfile.data as CreatorProfile).afreecaLogo
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
      {anchorEl && (
        <NotificationPopper
          anchorEl={anchorEl}
          handleAnchorClose={handleAnchorClose}
          successCallback={onNotificationUpdate}
        />
      )}

      {/* 유저 설정 리스트 */}
      {type === 'creator' && (
        <UserPopover
          handleLogoutClick={handleLogoutClick}
          doNoticePatchRequest={(): void => {
            noticeReadFlagPatch.doPatchRequest({ type });
          }}
        />
      )}

      {/* 유저 설정 리스트 */}
      {type === 'marketer' && (
        <MarketerPopover
          handleLogoutClick={handleLogoutClick}
          doNoticePatchRequest={(): void => {
            noticeReadFlagPatch.doPatchRequest({ type });
          }}
        />
      )}
    </div>
  );
}
