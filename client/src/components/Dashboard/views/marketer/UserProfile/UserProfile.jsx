import React from 'react';
// for Link tag component
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
// core ../../../components
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import PasswordForm from './PasswordForm';
import UserDataForm from './UserDataForm';
// 마케터 유저 프로필 및 개인정보 수정 페이지
const UserProfile = props => (
  <div>
    <GridContainer>
      {/* 개인 정보 관리 */}
      <GridItem xs={12} sm={12} md={6} xl={4}>
        <UserDataForm />
      </GridItem>
      {/* 비밀번호 변경 */}
      <GridItem xs={12} sm={12} md={6} xl={4}>
        <PasswordForm />
      </GridItem>
    </GridContainer>
  </div>
);

export default withStyles(dashboardStyle)(UserProfile);
