import React, { useState } from 'react';
import PropTypes from 'prop-types';
import shortId from 'shortid';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import axios from '../../../../utils/axios';

import Button from '../../components/Button';
import Typography from '../../components/Typography';
import LoginForm from '../Login/LoginForm';
import HOST from '../../../../config';

const useStyles = makeStyles(theme => ({
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 5),
  },
  title: {
    marginBottom: theme.spacing(14),
  },
  number: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
  },
  button: {
    marginTop: theme.spacing(8),
  },
  icon: {
    marginTop: 35,
    marginBottom: 30,
    fontSize: 48,
  },
}));

function useDialog() {
  const [open, setOpen] = useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  return { open, handleOpen, handleClose };
}

export default function ProductHowItWorksCreatorItem(props) {
  const {
    check, history, isLogin, source,
  } = props;
  const classes = useStyles();
  const { open, handleOpen, handleClose } = useDialog();

  function handleClick() {
    axios.get(`${HOST}/api/dashboard/checkUserType`).then((res) => {
      const { userType } = res.data;
      if (userType === undefined) {
        handleOpen();
      } else if (userType === 'creator') {
        history.push('/dashboard/creator/main');
      }
    });
  }

  return (
    <React.Fragment>
      <Grow
        in={check}
        {...(check ? { timeout: 1500 } : {})}
      >
        <Typography
          variant="h4"
          marked="center"
          align="center"
          className={classes.title}
          component="h2"
        >
          {source.title}
        </Typography>
      </Grow>
      <Grow
        in={check}
        {...(check ? { timeout: 1500 } : {})}
      >
        <Grid container spacing={5}>
          { source.items.map((value, index) => (
            <Grid item xs={12} md={4} key={shortId.generate()}>
              <div className={classes.item}>
                <div className={classes.number}>{`${index + 1}.`}</div>
                <value.icon className={classes.icon} />
                <Typography variant="h5" align="center">
                  {value.title}
                </Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </Grow>
      <Grow
        in={check}
        {...(check ? { timeout: 1500 } : {})}
      >
        <Button
          color="primary"
          size="large"
          variant="contained"
          className={classes.button}
          onClick={handleClick}
        >
          {isLogin
            ? '대시보드로 이동'
            : `${source.buttonText}`
            }
        </Button>
      </Grow>

      <LoginForm
        open={open}
        isMarketer={false}
        history={history}
        handleClose={handleClose}
      />
    </React.Fragment>
  );
}
ProductHowItWorksCreatorItem.propTypes = {
  check: PropTypes.bool.isRequired,
};
