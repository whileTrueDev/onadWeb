import React from 'react';
import PropTypes from 'prop-types';
// core
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
// own components
import Card from '../../../../components/Card/Card';
import CardHeader from '../../../../components/Card/CardHeader';
import CardBody from '../../../../components/Card/CardBody';
import Button from '../../../../components/CustomButtons/Button';
import DashboardStyle from '../../../../assets/jss/onad/views/dashboardStyle';

const useStyles = makeStyles(() => ({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between'
  },
  textBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));
function BusinessRegistrationUploadForm(props) {
  const myClasses = useStyles();
  const { classes } = props;
  const [businessRegistration] = React.useState(null);

  return (
    <Card>
      <CardHeader color="blueGray">
        <div className={myClasses.textBox}>
          <h4 className={classes.cardTitleWhite}>
            사업자 등록증 업로드
          </h4>
        </div>

      </CardHeader>


      { businessRegistration ? (
        <CardBody>
          <div className={myClasses.buttonWrapper}>
            <Button
              color="info"
            >
            사업자 등록증 변경
            </Button>
          </div>
          <div className={myClasses.textBox} style={{ marginTop: 5 }}>
            <Typography gutterBottom variant="body1">등록된 계좌</Typography>
          </div>
          <div className={myClasses.textBox} style={{ marginBottom: 10 }}>
            <Typography gutterBottom variant="body1">
              {businessRegistration}
            </Typography>
          </div>
        </CardBody>
      ) : (
        <CardBody>
          <div className={myClasses.buttonWrapper}>
            <Button
              color="info"
            >
            사업자 등록증 등록
            </Button>
          </div>
          <div className={myClasses.textBox} style={{ marginTop: 5 }}>
            <Typography gutterBottom variant="body1">아직 등록된 사업자 등록증이 없습니다.</Typography>
          </div>
          <div className={myClasses.textBox} style={{ marginBottom: 10 }}>
            <Typography gutterBottom variant="body1" style={{ color: '#00acc1' }}>등록</Typography>
            <Typography gutterBottom variant="body1">
              버튼을 눌러 사업자 등록증을 업로드해주세요.
            </Typography>
          </div>
        </CardBody>
      )}


    </Card>
  );
}

BusinessRegistrationUploadForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(DashboardStyle)(BusinessRegistrationUploadForm);
