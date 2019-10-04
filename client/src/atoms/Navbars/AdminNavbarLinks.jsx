import React from 'react';
import { Link } from 'react-router-dom';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import Hidden from '@material-ui/core/Hidden';
// @material-ui/icons
import Notifications from '@material-ui/icons/Notifications';
import Person from '@material-ui/icons/Person';
import Home from '@material-ui/icons/Home';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
// core components
// import Dialog from '../Dialog/Dialog';
import headerLinksStyle from '../../assets/jss/onad/components/headerLinksStyle';
import Button from '../CustomButtons/Button';
import Notification from './Notification';
import HOST from '../../utils/config';
import axios from '../../utils/axios';
import history from '../../history';

const useMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState();

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }
  return { anchorEl, handleMenuOpen, handleMenuClose };
};

function HeaderLinks(props) {
  const { classes } = props;

  function handleLogoutClick() {
    axios.get(`${HOST}/api/login/logout`).then(() => {
      history.push('/');
    });
  }

  const MOBILEWIDTH = 959;
  const { anchorEl, handleMenuOpen, handleMenuClose } = useMenu();

  return (
    <div>
      {/* notification */}
      {/* {window.location.pathname.includes('marketer')
        ? null
        : (
          <Hidden smDown>
            <Button
              color={window.innerWidth > MOBILEWIDTH ? 'transparent' : 'white'}
              justIcon={window.innerWidth > MOBILEWIDTH}
              simple={!(window.innerWidth > MOBILEWIDTH)}
              aria-label="notifications"
              className={classes.buttonLink}
              onClick={handleMenuOpen}
            >
              <Badge className={classes.margin} badgeContent={2} color="secondary">
                <Tooltip title="알림">
                  <Notifications className={classes.icons} />
                </Tooltip>
              </Badge>
            </Button>

            <Notification anchorEl={anchorEl} handleMenuClose={handleMenuClose} />
          </Hidden>

        )} */}

      <Hidden smDown>
        <Button
          color={window.innerWidth > MOBILEWIDTH ? 'transparent' : 'white'}
          justIcon={window.innerWidth > MOBILEWIDTH}
          simple={!(window.innerWidth > MOBILEWIDTH)}
          aria-label="User"
          className={classes.buttonLink}
          to={window.location.pathname.includes('marketer')
            ? '/dashboard/marketer/user'
            : '/dashboard/creator/user'}
          component={Link}
        >
          <Tooltip title="계정관리로 이동">
            <Person className={classes.icons} />
          </Tooltip>
        </Button>
      </Hidden>

      <Hidden smDown>
        <Button
          color={window.innerWidth > MOBILEWIDTH ? 'transparent' : 'white'}
          justIcon={window.innerWidth > MOBILEWIDTH}
          simple={!(window.innerWidth > MOBILEWIDTH)}
          aria-label="Dashboard"
          className={classes.buttonLink}
          to="/"
          component={Link}
        >
          <Tooltip title="홈으로 이동">
            <Home className={classes.icons} />
          </Tooltip>
        </Button>
      </Hidden>

      <Button
        color={window.innerWidth > MOBILEWIDTH ? 'transparent' : 'white'}
        justIcon={window.innerWidth > MOBILEWIDTH}
        simple
        aria-label="Logout"
        className={classes.buttonLink}
        onClick={handleLogoutClick}
      >
        <Tooltip title="로그아웃">
          <PowerSettingsNew className={classes.icons} />
        </Tooltip>
      </Button>
    </div>
  );
}

export default withStyles(headerLinksStyle)(HeaderLinks);
