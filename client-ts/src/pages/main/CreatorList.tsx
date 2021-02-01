import React from 'react';
import { Grow, Grid } from '@material-ui/core';
import shortid from 'shortid';
import useStyles from './style/CreatorList.style';
import AppAppBar from '../../organisms/main/layouts/AppAppbar';
import AppFooter from '../../organisms/main/layouts/AppFooter';
import RePasswordDialog from '../../organisms/main/main/login/RePassword';
import useLoginValue from '../../utils/hooks/useLoginValue';
import useGetRequest from '../../utils/hooks/useGetRequest';
import textSource from '../../organisms/main/Introduction/source/textSource';
import Card from '../../atoms/Card/Card';
import CardAvatar from '../../atoms/Card/CardAvatar';
import CardBody from '../../atoms/Card/CardBody';
import CircularProgress from '../../atoms/Progress/CircularProgress';

export interface ContractedCreatorListData<T> {
  creatorTwitchId: T;
  creatorName: T;
  creatorLogo: T;
}

export default function CreatorList(): JSX.Element {
  const {
    isLogin, repasswordOpen, logout, setRepassword
  } = useLoginValue();
  const classes = useStyles();
  const ContractedCreatorList = useGetRequest<null, ContractedCreatorListData<string>[]>('/creators');
  const LiveCreatorList = useGetRequest<null, string[]>('/creators/live');

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className={classes.root}>
        <div className={classes.containerWrap}>
          <AppAppBar isLogin={isLogin} logout={logout} MainUserType="marketer" />
          <div className={classes.maintop}>
            <div className={classes.loginMiddle}>
              <Grow in timeout={1500}>
                <h1 className={classes.h1}>
                  {textSource.heroSector.creatorList.title}
                </h1>
              </Grow>
              <div className={classes.h1sub}>
                {textSource.heroSector.creatorList.content.split('\n').map((row: string) => (
                  <p key={row}>{`${row}`}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.mainList}>
        <Grid container justify="center" alignItems="center">
          {LiveCreatorList.loading && (
            <div>
              <CircularProgress small />
              <h1 className={classes.loadingTitle}>크리에이터의 방송을 확인해보세요</h1>
            </div>
          )}
          {!ContractedCreatorList.loading && !LiveCreatorList.loading
            && LiveCreatorList.data && ContractedCreatorList.data
            && ContractedCreatorList.data.map((row) => (
              <Grid
                item
                xs={12}
                sm={5}
                md={2}
                className={classes.listWrapper}
                key={shortid.generate()}
              >
                <Card
                  profile
                  className={LiveCreatorList.data!.includes(row.creatorTwitchId)
                    ? (classes.live) : (classes.notlive)}
                >
                  <CardAvatar profile>
                    <a href={`https://www.twitch.tv/${row.creatorTwitchId}`}>
                      <img
                        src={row.creatorLogo}
                        alt="creatorLogo"
                        onError={(e) => { e.currentTarget.src = '/pngs/logo/onad_logo_vertical_small.png'; }}
                      />
                    </a>
                  </CardAvatar>
                  <CardBody profile>
                    {LiveCreatorList.data!.includes(row.creatorTwitchId) && (
                      <h4 className={classes.liveTitle}>LIVE</h4>
                    )}
                    <h4 className={classes.cardTitle}>
                      {`${row.creatorName}`}
                    </h4>
                  </CardBody>
                </Card>
              </Grid>
            ))}
        </Grid>
      </div>
      <AppFooter />
      <RePasswordDialog
        repasswordOpen={repasswordOpen}
        setRepassword={setRepassword}
        logout={logout}
      />
    </div>
  );
}
