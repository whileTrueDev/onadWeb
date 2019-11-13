import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
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
// import Dialog from '../Dialog/Dialog';
import headerLinksStyle from '../../assets/jss/onad/components/headerLinksStyle';
import Notification from './Notification';
import HOST from '../../utils/config';
import axios from '../../utils/axios';
import history from '../../history';
import useFetchData from '../../utils/lib/hooks/useFetchData';

const useMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }
  function handleMenuClose() {
    setAnchorEl(null);
  }
  return { anchorEl, handleMenuOpen, handleMenuClose };
};

function HeaderLinks() {
  const userType = window.location.pathname.split('/')[2];
  const NotificationData = useFetchData(`/api/dashboard/${userType}/notification`);
  function handleLogoutClick() {
    axios.get(`${HOST}/api/login/logout`).then(() => {
      history.push('/');
    });
  }

  const { anchorEl, handleMenuOpen, handleMenuClose } = useMenu();

  return (
    <div>
      {/* notification */}
      <Tooltip title="알림">
        <IconButton
          aria-label="notifications"
          onClick={handleMenuOpen}
        >
          <Badge
            badgeContent={!NotificationData.loading && NotificationData.payload
              ? (NotificationData.payload.unReadCount)
              : (null)}
            color="secondary"
          >
            <Notifications fontSize="large" />
          </Badge>
        </IconButton>
      </Tooltip>
      <Notification
        anchorEl={anchorEl}
        handleMenuClose={handleMenuClose}
        notificationData={NotificationData}
      />

      <Hidden smDown>
        <Tooltip title="계정관리로 이동">
          <IconButton
            aria-label="User"
            to={window.location.pathname.includes('marketer')
              ? '/dashboard/marketer/myoffice'
              : '/dashboard/creator/user'}
            component={Link}
          >
            <Person fontSize="large" />
          </IconButton>
        </Tooltip>
      </Hidden>

      <Hidden smDown>
        <Tooltip title="공지사항으로 이동">
          <IconButton
            aria-label="to-notice"
            to="/notice"
            component={Link}
          >
            <Badge
              variant="dot"
              color="secondary"
            >
              <SpeakerNotes fontSize="large" />
            </Badge>
          </IconButton>
        </Tooltip>
      </Hidden>

      <Hidden smDown>
        <Tooltip title="홈으로 이동">
          <IconButton
            aria-label="to-dashboard"
            to="/"
            component={Link}
          >
            <Home fontSize="large" />
          </IconButton>
        </Tooltip>
      </Hidden>

      <Tooltip title="로그아웃">
        <IconButton
          onClick={handleLogoutClick}
          aria-label="logout"
        >
          <PowerSettingsNew fontSize="large" />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default withStyles(headerLinksStyle)(HeaderLinks);
