import React from 'react';
// @material-ui/core
import {
  makeStyles, Paper, TextField, Typography
} from '@material-ui/core';
import Button from '../../../../../atoms/CustomButtons/Button';
import UserDataUpdateDialog from './UserDataUpdateDialog';

import { UserInterface } from '../interface';
import useDialog from '../../../../../utils/hooks/useDialog';

const useStyles = makeStyles((theme) => ({
  textfield: { display: 'flex', flexDirection: 'column' },
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
    <Paper style={{ padding: 32, marginTop: 8 }}>
      <Typography style={{ fontWeight: 'bold' }}>
        {`${userData.marketerName} 님의 정보`}
      </Typography>
      <Typography variant="body2" color="textSecondary">정보를 변경하시려면 정보변경을 클릭하세요.</Typography>

      <div className={classes.textfield}>
        <TextField
          label="이름"
          fullWidth
          style={{ maxWidth: 500 }}
          value={userData.marketerName || ''}
          id="name"
          margin="normal"
          InputProps={{ readOnly: true, }}
          InputLabelProps={{ shrink: true, }}
        />
        <TextField
          label="이메일"
          fullWidth
          style={{ maxWidth: 500 }}
          value={userData.marketerMail || ''}
          id="mail"
          margin="normal"
          InputProps={{ readOnly: true, }}
          InputLabelProps={{ shrink: true, }}
        />
        <TextField
          label="휴대폰번호"
          fullWidth
          style={{ maxWidth: 500 }}
          value={userData.marketerPhoneNum || ''}
          margin="normal"
          InputProps={{ readOnly: true, }}
          InputLabelProps={{ shrink: true, }}
        />
      </div>

      <Button
        onClick={(): void => {
          userDataUpdateDialog.handleOpen();
        }}
        color="primary"
      >
          정보변경
      </Button>


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
