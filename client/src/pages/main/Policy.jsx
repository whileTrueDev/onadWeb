import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import AppAppBar from '../../organisms/main/layout/AppAppBar';
import AppFooter from '../../organisms/main/layout/AppFooter';
import RePasswordDialog from '../../organisms/main/Main/views/Login/RePassword';
import withRoot from '../../organisms/main/Main/withRoot';
import useLoginValue from '../../utils/lib/hooks/useLoginValue';
import Policy from '../../organisms/main/Policy/Policy';
import PolicyPrivacy from '../../organisms/main/Policy/PolicyPrivacy';


const useStyles = makeStyles(() => ({
  root: {
    paddingTop: 70
  },
  contentBox: {
    width: '80%',
    margin: '0px auto',
    wordBreak: 'keep-all'
  },
  policyTitle: {
    paddingTop: '10px',
  },
  button: {
    marginRight: 40,
  },

}));

export default withRoot((props) => {
  // if located here, set the scroll to top of the page
  const { history, location } = props;
  const {
    isLogin, repasswordOpen, logout, setRepassword
  } = useLoginValue(history, location);

  const { match } = props;
  const { privacy } = match.params;
  const classes = useStyles();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div>
      <div className={classes.root}>
        <div className={classes.contentBox}>
          <Grid container direction="row" alignItems="center" justify="space-between">

            <Grid item>
              <h1 className={classes.policyTitle}>ONAD Policy</h1>
            </Grid>
            <Grid item>
              <Button
                className={classes.button}
                component={Link}
                color="secondary"
                to="/policy"
              >
                이용약관
              </Button>
              <Button
                className={classes.button}
                component={Link}
                color="secondary"
                to="/policy/privacy"
              >
                개인정보 처리방침
              </Button>
            </Grid>

          </Grid>
          <Grid container>
            {privacy ? (<PolicyPrivacy />) : (<Policy />)}
          </Grid>
        </div>
      </div>
      <AppFooter />
      <RePasswordDialog
        repasswordOpen={repasswordOpen}
        setRepassword={setRepassword}
        logout={logout}
      />
    </div>
  );
});
