import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Typography, Divider } from '@material-ui/core';
import Card from './Card/Card';
import CardHeader from './Card/CardHeader';
import CardBody from './Card/CardBody';
import DashboardStyle from '../../assets/jss/onad/views/dashboardStyle';

const drawerWidth = 230;

const transition = {
  transition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
};

const useStyles = makeStyles(theme => ({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between'
  },
  secondary: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.54)',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0px',
    },
  },
  textBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    justifyContent: 'keft',
    alignItems: 'left',
  }
}));

function CustomizedCard(props) {
  const customizedClasses = useStyles();
  const {
    classes, title, subTitle, children
  } = props;
  return (
    <Card>
      <CardHeader
        color="blueGray"
        className={customizedClasses.header}
      >
        <h4 className={classes.cardTitleWhite}>
          {title}
        </h4>
      </CardHeader>
      <CardBody>
        {/* <div className={myClasses.buttonWrapper}>
          <Button
            color="info"
            onClick={handleOpen}
          >
          환불계좌 등록
          </Button>
        </div> */}
        <div style={{ marginTop: 5 }}>
          <Typography className={customizedClasses.secondary}>{subTitle}</Typography>
          <Divider component="hr" style={{ height: '2px', margin: '5px' }} />
        </div>
        <div className={customizedClasses.textBox} style={{ marginBottom: 10 }}>
          {children}
        </div>
      </CardBody>
    </Card>
  );
}
export default withStyles(DashboardStyle)(CustomizedCard);
