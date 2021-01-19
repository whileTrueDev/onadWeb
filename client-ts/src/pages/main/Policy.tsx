import React from 'react';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import useStyles from './style/Policy.style';
import AppFooter from '../../organisms/main/layouts/AppFooter';
import RePasswordDialog from '../../organisms/main/main/login/RePassword';
import useLoginValue from '../../utils/hooks/useLoginValue';
import Policy from '../../organisms/main/policy/Policy';
import PolicyPrivacy from '../../organisms/main/policy/PolicyPrivacy';

interface Props {
  match: { params: { privacy: string } };
}

export default ({ match }: Props): JSX.Element => {
  const {
    repasswordOpen, logout, setRepassword
  } = useLoginValue();

  const { privacy } = match.params;
  const classes = useStyles();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
};
