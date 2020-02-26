import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
import { TextField } from '@material-ui/core';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import Card from '../../../../atoms/Card/Card';
import CardHeader from '../../../../atoms/Card/CardHeader';
import CardBody from '../../../../atoms/Card/CardBody';
import CardFooter from '../../../../atoms/Card/CardFooter';
import Button from '../../../../atoms/CustomButtons/Button';
import dashboardStyle from '../../../../assets/jss/onad/views/dashboardStyle';
import UserDataUpdateDialog from './UserDataUpdateDialog';
import useDialog from '../../../../utils/lib/hooks/useDialog';


dashboardStyle.textField = {
  width: '100%',
  marginTop: '15px',
  borderColor: '#00acc1',
  '& .MuiFormLabel-root ': {
    color: '#00acc1',
  },
  '& .MuiInputBase-input:before': {
    color: '#00acc1',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#00acc1',
  },
};

const UserDataForm = (props) => {
  const { classes, userData, callUrl } = props;

  const userDataUpdateDialog = useDialog();

  return (
    <Card>
      <CardHeader color="blueGray">
        <h4 className={classes.cardTitleWhite}>
          {userData.marketerName}
          {' '}
          님의 정보
        </h4>
        <p className={classes.cardCategoryWhite}>정보를 변경하시려면 정보변경을 클릭하세요.</p>
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
          <GridItem xs={12} sm={12} md={9}>
            {userData.marketerUserType
              ? (
                <TextField
                  label="COMPANY REGISTRATION NUMBER"
                  className={classes.textField}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={userData.marketerBusinessRegNum}
                />
              )
              : <div />
          }
          </GridItem>
        </GridContainer>
      </CardBody>
      <CardFooter>
        <Button
          onClick={() => {
            userDataUpdateDialog.handleOpen();
          }}
          color="info"
        >
        정보변경
        </Button>
      </CardFooter>
      <UserDataUpdateDialog
        open={userDataUpdateDialog.open}
        userData={userData}
        callUrl={callUrl}
        handleClose={() => {
          userDataUpdateDialog.handleClose();
        }}
      />
    </Card>
  );
};

UserDataForm.propTypes = {
  userData: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(UserDataForm);
