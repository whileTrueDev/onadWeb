// core components
import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Tooltip,
} from '@material-ui/core';
// @material-ui/core components
import Badge from '@material-ui/core/Badge';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import NightsStayIcon from '@material-ui/icons/NightsStay';
// @material-ui/icons
import Person from '@material-ui/icons/Person';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import SpeakerNotes from '@material-ui/icons/SpeakerNotes';
import Router from 'next/router';
import CenterLoading from '../../../../../atoms/loading/centerLoading';
import { useMypageStore } from '../../../../../store/mypageStore';
import { OnadTheme } from '../../../../../theme';
import { useUpdateNoticeReadFlagMutation } from '../../../../../utils/hooks/mutation/useUpdateNoticeReadFlagMutation';
import { useMarketerProfile } from '../../../../../utils/hooks/query/useMarketerProfile';
import { useNoticeReadFlag } from '../../../../../utils/hooks/query/useNoticeReadFlag';

enum THEME_TYPE {
  DARK = 'dark',
  LIGHT = 'light',
}

const useStyles = makeStyles(theme => ({
  container: { width: 280 },
  icon: { marginRight: theme.spacing(2) },
}));
export interface MarketerPopoverProps {
  handleLogoutClick: () => void;
}
export default function MarketerPopover(props: MarketerPopoverProps): JSX.Element {
  const { handleLogoutClick } = props;

  const marketerInfo = useMarketerProfile();
  const noticeReadFlag = useNoticeReadFlag();
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
          {marketerInfo.isLoading && <CenterLoading height={50} />}
          {!marketerInfo.isLoading && marketerInfo.data && (
            <ListItem style={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="변경하러가기" arrow>
                <IconButton
                  onClick={(): void => {
                    Router.push('/mypage/marketer/user');
                    handleUserMenuClose();
                  }}
                >
                  <Avatar src={marketerInfo.data.profileImage} />
                </IconButton>
              </Tooltip>
              <ListItemText
                primary={marketerInfo.data.marketerName}
                secondary={marketerInfo.data.marketerMail}
              />
            </ListItem>
          )}
        </List>
        <Divider />

        {/* 설정 */}
        <List>
          <ListItem
            button
            aria-label="User"
            onClick={(): void => {
              handleUserMenuClose();
              Router.push('/mypage/marketer/user');
            }}
          >
            <Person color="action" className={classes.icon} />
            <ListItemText primary="내 정보" />
          </ListItem>
          <ListItem
            button
            aria-label="to-notice"
            onClick={(): void => {
              if (!noticeReadFlag.isLoading && !noticeReadFlag.data?.noticeReadState) {
                noticeReadFlagPatch.mutate();
              }
              handleUserMenuClose();
              Router.push('/mypage/marketer/notice');
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
              if (localStorage.getItem('themeType') === THEME_TYPE.DARK) {
                localStorage.setItem('themeType', THEME_TYPE.LIGHT);
              } else {
                localStorage.setItem('themeType', THEME_TYPE.DARK);
              }
              Router.reload();
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
