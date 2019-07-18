import React from 'react';
import { Link } from 'react-router-dom';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
// @material-ui/icons
import Person from '@material-ui/icons/Person';
import Dashboard from '@material-ui/icons/Dashboard';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import axios from '../../../../utils/axios';
// core components
import headerLinksStyle from '../../assets/jss/onad/components/headerLinksStyle';
import Button from '../CustomButtons/Button';
import HOST from '../../../../config';

function HeaderLinks(props) {
  const { classes, history } = props;
  function handleLogoutClick() {
    axios.get(`${HOST}/api/login/logout`).then(() => {
      history.push('/');
    });
  }

  const MOBILEWIDTH = 959;

  return (
    <div>
      <Button
        color={window.innerWidth > MOBILEWIDTH ? 'transparent' : 'white'}
        justIcon={window.innerWidth > MOBILEWIDTH}
        simple={!(window.innerWidth > MOBILEWIDTH)}
        aria-label="Dashboard"
        className={classes.buttonLink}
        to={window.location.pathname.includes('marketer')
          ? '/dashboard/marketer/main'
          : '/dashboard/creator/main'}
        component={Link}
      >
        <Tooltip title="대시보드로 이동">
          <Dashboard className={classes.icons} />
        </Tooltip>
      </Button>

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

      <Button
        color={window.innerWidth > MOBILEWIDTH ? 'transparent' : 'white'}
        justIcon={window.innerWidth > MOBILEWIDTH}
        simple={!(window.innerWidth > MOBILEWIDTH)}
        aria-label="User"
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
