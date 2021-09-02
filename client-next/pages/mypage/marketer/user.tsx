import { CircularProgress, makeStyles, Typography } from '@material-ui/core';
import { useContext } from 'react';
import GridContainer from '../../../atoms/grid/gridContainer';
import GridItem from '../../../atoms/grid/gridItem';
import MarketerInfoContext from '../../../context/marketerInfo.context';
import SignOut from '../../../components/mypage/marketer/user/profile/signOut';
import UserDataForm from '../../../components/mypage/marketer/user/profile/userDataForm';
import DashboardLayout from '../../../components/mypage/layouts/marketerDashboardLayout';

const useStyles = makeStyles(theme => ({
  // container: { margin: '0 auto', maxWidth: 1430 },
  title: { marginTop: theme.spacing(2), color: theme.palette.text.primary },
}));
export default function MyInfo(): JSX.Element {
  const classes = useStyles();
  const marketerInfo = useContext(MarketerInfoContext);
  return (
    <div>
      {/* 계정 관리 */}
      {marketerInfo.loading && <CircularProgress />}
      {!marketerInfo.loading && marketerInfo.user && (
        <div>
          <GridContainer>
            <GridItem xs={12}>
              <Typography className={classes.title} variant="h6">
                내 정보 관리
              </Typography>
            </GridItem>
            <GridItem xs={12} lg={6}>
              <UserDataForm userData={marketerInfo.user} />
            </GridItem>
          </GridContainer>

          {/* 회원탈퇴 */}
          <GridContainer>
            <GridItem xs={12}>
              <SignOut userData={marketerInfo.user} />
            </GridItem>
          </GridContainer>
        </div>
      )}
    </div>
  );
}

MyInfo.layout = DashboardLayout;
