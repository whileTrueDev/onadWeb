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
import {
  Divider,
  List,
  ListItem,
  Popover,
  Avatar,
  ListItemText,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import { OnadTheme } from '../../../../../theme';
import { MarketerInfo } from '../../../marketer/office/interface';
import history from '../../../../../history';
import { useMypageStore } from '../../../../../store/mypageStore';

const useStyles = makeStyles(theme => ({
  container: { width: 280 },
  icon: { marginRight: theme.spacing(2) },
}));
export interface MarketerPopoverProps {
  userData: MarketerInfo;
  handleLogoutClick: () => void;
  noticeReadFlagGet: UseGetRequestObject<{ noticeReadState: number }>;
  doNoticePatchRequest: () => void;
}
export default function MarketerPopover(props: MarketerPopoverProps): JSX.Element {
  const { userData, handleLogoutClick, noticeReadFlagGet, doNoticePatchRequest } = props;

  const userMenuAnchor = useMypageStore(state => state.userMenuAnchor);
  const handleUserMenuClose = useMypageStore(state => state.handleUserMenuClose);

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
          <ListItem style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="변경하러가기" arrow>
              <IconButton onClick={(): void => history.push('/mypage/marketer/user')}>
                <Avatar src={userData.profileImage} />
              </IconButton>
            </Tooltip>
            <ListItemText primary={userData.marketerName} secondary={userData.marketerMail} />
          </ListItem>
        </List>
        <Divider />

        {/* 설정 */}
        <List>
          <ListItem button aria-label="User" to="/mypage/marketer/user" component={Link}>
            <Person color="action" className={classes.icon} />
            <ListItemText primary="내 정보" />
          </ListItem>
          <ListItem
            button
            aria-label="to-notice"
            to="/mypage/marketer/notice"
            component={Link}
            onClick={(): void => {
              if (!noticeReadFlagGet.loading && noticeReadFlagGet.data) {
                doNoticePatchRequest();
              }
            }}
          >
            {!noticeReadFlagGet.loading &&
            noticeReadFlagGet.data &&
            noticeReadFlagGet.data.noticeReadState === 0 ? (
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
