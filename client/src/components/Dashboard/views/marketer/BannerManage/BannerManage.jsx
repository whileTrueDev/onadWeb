import React from 'react';
// for Link tag component
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
// core ../../../components
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';

const BannerManage = (props) => {
  const [variable, setVariable] = React.useState();
  return (<div>배너 관리 탭</div>);
};

export default withStyles(dashboardStyle)(BannerManage);
