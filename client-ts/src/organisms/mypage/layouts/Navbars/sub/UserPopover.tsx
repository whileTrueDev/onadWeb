import { Link } from 'react-router-dom';
// @material-ui/core components
import Badge from '@material-ui/core/Badge';
// @material-ui/icons
import Person from '@material-ui/icons/Person';
import SpeakerNotes from '@material-ui/icons/SpeakerNotes';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import NightsStayIcon from '@material-ui/icons/NightsStay';
// core components
import { Divider, List, ListItem, Popover, Avatar, ListItemText } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { OnadTheme } from '../../../../../theme';
import { useMypageStore } from '../../../../../store/mypageStore';
import { useNoticeReadFlag } from '../../../../../utils/hooks/query/useNoticeReadFlag';
import { useCreatorProfile } from '../../../../../utils/hooks/query/useCreatorProfile';
import CenterLoading from '../../../../../atoms/Loading/CenterLoading';
import { useUpdateNoticeReadFlagMutation } from '../../../../../utils/hooks/mutation/useUpdateNoticeReadFlagMutation';

const useStyles = makeStyles(theme => ({
  container: { width: 280 },
  icon: { marginRight: theme.spacing(2) },
}));

export interface UserPopoverProps {
  handleLogoutClick: () => void;
}
export default function UserPopover(props: UserPopoverProps): JSX.Element {
  const { handleLogoutClick } = props;

  const noticeReadFlag = useNoticeReadFlag();
  const user = useCreatorProfile();
  const noticeReadFlagPatch = useUpdateNoticeReadFlagMutation();

  const userMenuAnchor = useMypageStore(x => x.userMenuAnchor);
  const handleUserMenuClose = useMypageStore(x => x.handleUserMenuClose);

  const theme = useTheme<OnadTheme>();
  const classes = useStyles();

  return (
    <Popover
      open={!!userMenuAnchor}
      anchorEl={userMenuAnchor}
      onClose={handleUserMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      disableScrollLock
    >
      <div className={classes.container}>
        {/* 유저 정보 */}
        <List>
          {user.isLoading && <CenterLoading />}
          {!user.isLoading && user.data && (
            <ListItem style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                className={classes.icon}
                src={user.data.creatorLogo || user.data.afreecaLogo || ''}
              />
              {/* 트위치만 연동된 경우 */}
              {user.data.creatorName && (
                <ListItemText
                  primary={`${user.data.creatorName} (${user.data.loginId})`}
                  secondary={user.data.creatorMail || ''}
                />
              )}

              {/* 아프리카만 연동된 경우 */}
              {!user.data.creatorName && user.data.afreecaName && (
                <ListItemText
                  primary={`${user.data.afreecaName} (${user.data.loginId})`}
                  secondary={user.data.creatorMail || ''}
                />
              )}

              {/* 트위치, 아프리카 모두 연동 안된 경우 */}
              {!user.data.creatorName && !user.data.afreecaName && (
                <ListItemText primary={user.data.loginId} secondary={user.data.creatorMail || ''} />
              )}
            </ListItem>
          )}
        </List>
        <Divider />

        {/* 설정 */}
        <List>
          <ListItem button aria-label="User" to="/mypage/creator/user" component={Link}>
            <Person color="action" className={classes.icon} />
            <ListItemText primary="내 정보" />
          </ListItem>
          <ListItem
            button
            aria-label="to-notice"
            to="/mypage/creator/notice"
            component={Link}
            onClick={(): void => {
              if (!noticeReadFlag.isLoading && noticeReadFlag.data) {
                noticeReadFlagPatch.mutate();
              }
            }}
          >
            {!noticeReadFlag.isLoading &&
            noticeReadFlag.data &&
            noticeReadFlag.data.noticeReadState === 0 ? (
              <Badge variant="dot" color="primary" className={classes.icon}>
                <SpeakerNotes color="action" />
              </Badge>
            ) : (
              <SpeakerNotes color="action" className={classes.icon} />
            )}
            <ListItemText primary="공지사항으로 이동" />
          </ListItem>

          <ListItem
            button
            onClick={(): void => {
              theme.handleThemeChange();
            }}
          >
            {theme.palette.type === 'light' && (
              <EmojiObjectsIcon color="action" className={classes.icon} />
            )}
            {theme.palette.type === 'dark' && (
              <NightsStayIcon color="action" className={classes.icon} />
            )}
            <ListItemText primary="밝은/어두운 테마 변경" />
          </ListItem>
        </List>
        <Divider />

        {/* 로그아웃 */}
        <List>
          <ListItem button onClick={handleLogoutClick} aria-label="logout">
            <PowerSettingsNew color="action" className={classes.icon} />
            <ListItemText primary="로그아웃" />
          </ListItem>
        </List>
      </div>
    </Popover>
  );
}
