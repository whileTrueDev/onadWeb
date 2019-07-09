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
      <GridItem xs={12} sm={12} md={6}>
        <UserDataForm />
      </GridItem>
      <GridItem xs={12} sm={12} md={6}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <PasswordForm />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            {/*
              <Card>
                <CardHeader color="blueGray">
                  <h4 className={classes.cardTitleWhite}>
                    추가할 수정사항
                  </h4>
                  <p className={classes.cardCategoryWhite}>변경할 비밀번호를 입력하세요.</p>
                </CardHeader>
                <CardBody />
                <CardFooter>
                  <Button type="submit" value="Submit" color="info">확인</Button>
                </CardFooter>
              </Card> */}
          </GridItem>
        </GridContainer>

      </GridItem>
    </GridContainer>
  </div>
);

export default withStyles(dashboardStyle)(UserProfile);
