import React from 'react';
// @material-ui/core
import { withStyles } from '@material-ui/core/styles';
import { TextField, Typography } from '@material-ui/core';
import GridContainer from '../../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../../atoms/Grid/GridItem';
import Card from '../../../../../atoms/Card/Card';
import CardHeader from '../../../../../atoms/Card/CardHeader';
import CardBody from '../../../../../atoms/Card/CardBody';
import Button from '../../../../../atoms/CustomButtons/Button';
import dashboardStyle from '../../../../../assets/jss/views/dashboardStyle';
import UserDataUpdateDialog from './UserDataUpdateDialog';

import { UserInterface } from '../interface';
import useDialog from '../../../../../utils/hooks/useDialog';

interface UserDataFormProps {
  userData: UserInterface;
  doGetRequest: () => void;
  classes: any;
}

const UserDataForm = (props: UserDataFormProps): JSX.Element => {
  const { classes, userData, doGetRequest } = props;
  // const classes = useStyles();
  const userDataUpdateDialog = useDialog();

  return (
    <Card>
      <CardHeader color="blueGray">
        <Typography variant="h6">
          {userData.marketerName}
          {' '}
          님의 정보
        </Typography>
        <Typography variant="caption">정보를 변경하시려면 정보변경을 클릭하세요.</Typography>
      </CardHeader>
      <CardBody>
        <GridContainer>
          <GridItem xs={12} sm={12} md={5}>
            <TextField
              label="NAME"
              value={userData.marketerName || ''}
              className={classes.textField}
              id="name"
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={7} />
          <GridItem xs={12} sm={12} md={7}>
            <TextField
              label="EMAIL"
              value={userData.marketerMail || ''}
              className={classes.textField}
              id="mail"
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <TextField
              label="PHONE"
              value={userData.marketerPhoneNum || ''}
              className={classes.textField}
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={5} />
          <GridItem xs={12} sm={12} md={3}>
            <TextField
              label="TYPE"
              value={!userData.marketerUserType ? '일반인' : '사업자'}
              className={classes.textField}
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </GridItem>
        </GridContainer>
        <Button
          onClick={(): void => {
            userDataUpdateDialog.handleOpen();
          }}
          size="medium"
          color="primary"
        >
          정보변경
        </Button>
      </CardBody>
      <UserDataUpdateDialog
        open={userDataUpdateDialog.open}
        userData={userData}
        doGetRequest={doGetRequest}
        handleClose={(): void => {
          userDataUpdateDialog.handleClose();
        }}
      />
    </Card>
  );
};


export default withStyles(dashboardStyle)(UserDataForm);
