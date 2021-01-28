import React from 'react';
// @material-ui/core
import {
  Avatar,
  Button,
  makeStyles, Paper, Typography
} from '@material-ui/core';
import UserDataUpdateDialog from './UserDataUpdateDialog';

import { UserInterface } from '../interface';
import useDialog from '../../../../../utils/hooks/useDialog';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2)
    }
  },
  hero: { display: 'flex', alignItems: 'center', },
  avatar: {
    width: 100,
    height: 100,
    margin: theme.spacing(1, 2, 1, 0),
    [theme.breakpoints.down('xs')]: {
      width: 40, height: 40
    }
  },
}));
interface UserDataFormProps {
  userData: UserInterface;
  doGetRequest: () => void;
}

const UserDataForm = (props: UserDataFormProps): JSX.Element => {
  const classes = useStyles();
  const { userData, doGetRequest } = props;
  const userDataUpdateDialog = useDialog();
  return (
    <Paper className={classes.container}>

      <div className={classes.hero}>
        <Avatar variant="circular" className={classes.avatar} />
        <div>
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>
            {userData.marketerName}
          </Typography>
          <Typography variant="body2">{userData.marketerMail}</Typography>
          <Typography variant="body2">{userData.marketerPhoneNum}</Typography>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={(): void => { userDataUpdateDialog.handleOpen(); }}
          >
            정보변경
          </Button>
        </div>
      </div>

      <UserDataUpdateDialog
        open={userDataUpdateDialog.open}
        userData={userData}
        doGetRequest={doGetRequest}
        handleClose={(): void => {
          userDataUpdateDialog.handleClose();
        }}
      />
    </Paper>
  );
};


export default UserDataForm;
