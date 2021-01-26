import React from 'react';
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
  Divider, List, ListItem, Popover, Avatar, ListItemText, capitalize
} from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import { OnadTheme } from '../../../../../theme';
import { ContractionDataType } from '../../../../../pages/mypage/creator/CPAManage';

const useStyles = makeStyles((theme) => ({
  container: { width: 280, },
  icon: { marginRight: theme.spacing(2) }
}));

export interface UserPopoverProps {
  open: boolean;
  userData: ContractionDataType;
  anchorEl?: HTMLElement | null;
  handleAnchorClose: () => void;
  handleLogoutClick: () => void;
  noticeReadFlagGet: UseGetRequestObject<{noticeReadState: number}>;
  doNoticePatchRequest: () => void;
}
export default function UserPopover(props: UserPopoverProps): JSX.Element {
  const {
    open,
    userData,
    anchorEl,
    handleAnchorClose,
    handleLogoutClick,
    noticeReadFlagGet,
    doNoticePatchRequest,
  } = props;

  const theme = useTheme<OnadTheme>();
  const classes = useStyles();

  return (
    <Popover
      open={open}
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
    >
      <div className={classes.container}>
        {/* 유저 정보 */}
        <List>
          <ListItem style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar className={classes.icon} src={userData.creatorLogo || userData.afreecaLogo || ''}>
              {userData.loginId ? capitalize(userData.loginId[0]) : ''}
            </Avatar>
            {/* 트위치만 연동된 경우 */}
            {userData.creatorName && (
            <ListItemText primary={`${userData.creatorName} (${userData.loginId})`} secondary={userData.creatorMail || ''} />
            )}

            {/* 아프리카만 연동된 경우 */}
            {!userData.creatorName && userData.afreecaName && (
              <ListItemText primary={`${userData.afreecaName} (${userData.loginId})`} secondary={userData.creatorMail || ''} />
            )}

            {/* 트위치, 아프리카 모두 연동 안된 경우 */}
            {!userData.creatorName && !userData.afreecaName && (
            <ListItemText primary={userData.loginId} secondary={userData.creatorMail || ''} />
            )}
          </ListItem>
        </List>
        <Divider />

        {/* 설정 */}
        <List>
          <ListItem
            button
            aria-label="User"
            to={window.location.pathname.includes('marketer')
              ? '/mypage/marketer/myoffice'
              : '/mypage/creator/user'}
            component={Link}
          >
            <Person color="action" className={classes.icon} />
            <ListItemText primary="내 정보" />
          </ListItem>
          <ListItem
            button
            aria-label="to-notice"
            to="/notice"
            component={Link}
            onClick={(): void => {
              if (!noticeReadFlagGet.loading && noticeReadFlagGet.data) {
                doNoticePatchRequest();
              }
            }}
          >
            {!noticeReadFlagGet.loading
                && noticeReadFlagGet.data
                && noticeReadFlagGet.data.noticeReadState === 0 ? (
                  <Badge variant="dot" color="primary" className={classes.icon}>
                    <SpeakerNotes color="action" />
                  </Badge>
              ) : (
                <SpeakerNotes color="action" className={classes.icon} />
              )}
            <ListItemText primary="공지사항으로 이동" />

          </ListItem>

          <ListItem button onClick={(): void => { theme.handleThemeChange(); }}>
            {theme.palette.type === 'light' && (<EmojiObjectsIcon color="action" className={classes.icon} />)}
            {theme.palette.type === 'dark' && (<NightsStayIcon color="action" className={classes.icon} />)}
            <ListItemText primary="밝은/어두운 테마 변경" />
          </ListItem>
        </List>
        <Divider />

        {/* 로그아웃 */}
        <List>
          <ListItem
            button
            onClick={handleLogoutClick}
            aria-label="logout"
          >
            <PowerSettingsNew color="action" className={classes.icon} />
            <ListItemText primary="로그아웃" />
          </ListItem>
        </List>
      </div>
    </Popover>
  );
}
