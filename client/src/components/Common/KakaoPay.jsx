import React from 'react';
import axios from 'axios';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import HOST from '../../config';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#fff',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: theme.spacing(20),
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
  },
  linkButton: {
    color: '#fff',
    maxWidth: '250px',
    height: '80px',
    textTransform: 'none',
    backgroundColor: '#00b1dc',
    '&:hover': {
      backgroundColor: '#00a1dc',
    },
  },
}));

export default function NotFound() {
  const classes = useStyles();

  const [payData, setPayData] = React.useState(null);

  function handleClick() {
    axios.post(`${HOST}/api/pay/kakao`)
      .then((res) => {
        setPayData(res);
      });
    return null;
  }
  console.log(payData);

  return (
    <div className={classes.root}>
      <div className={classes.container}>

        <img src="/pngs/logo/onad_logo.png" alt="logo" />

        <Button
          className={classes.linkButton}
          size="large"
          onClick={handleClick}
        >
          카카오페이 결제하기
        </Button>
        {payData && (
          payData.data
        )}

      </div>
    </div>
  );
}
