import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grow, Grid } from '@material-ui/core';
import shortid from 'shortid';
import AppAppBar from '../../organisms/main/layouts/AppAppbar';
import AppFooter from '../../organisms/main/layouts/AppFooter';
import RePasswordDialog from '../../organisms/main/main/views/login/RePassword';
import useLoginValue from '../../utils/hooks/useLoginValue';
import useGetRequest from '../../utils/hooks/useGetRequest';
import textSource from '../../organisms/main/Introduction/source/textSource';
import Card from '../../atoms/Card/Card';
import CardAvatar from '../../atoms/Card/CardAvatar';
import CardBody from '../../atoms/Card/CardBody';
import CircularProgress from '../../atoms/Progress/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'url(\'/pngs/main/loading.gif\') no-repeat center center',
    backgroundSize: 'cover',
    width: '100%',
    height: '700px',
    [theme.breakpoints.down('md')]: {
      height: '600px',
    },
    [theme.breakpoints.down('sm')]: {
      height: '500px'
    },
    [theme.breakpoints.down('xs')]: {
      height: '600px'
    }
  },
  containerWrap: {
    backgroundColor: 'rgb(0,0,0, 0.6)',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginMiddle: {
    color: 'white',
    textAlign: 'left',
    width: '50%',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    marginRight: 30,
  },
  h1: {
    marginTop: '10px',
    marginBottom: '5px',
    fontSize: 45,
    fontWeight: 600,
    [theme.breakpoints.down('md')]: {
      fontSize: 35,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 27,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
  },
  h1sub: {
    marginTop: 40,
    marginBottom: 40,
    [theme.breakpoints.down('md')]: {
      fontSize: 18,
      marginTop: 35,
      marginBottom: 35,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 15,
      marginTop: 30,
      marginBottom: 30,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      marginTop: 20,
      marginBottom: 20,
    },
  },
  maintop: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainList: {
    padding: '80px 10%'
  },
  listWrapper: {
    padding: 20,
  },
  cardTitle: {
    fontFamily: 'S-CoreDream-8Heavy',
    fontSize: 22,
    margin: 0
  },
  liveTitle: {
    fontFamily: 'S-CoreDream-8Heavy',
    fontSize: 22,
    margin: 0,
    background: 'red',
    color: 'white'
  },
  live: {
    borderRadius: '10px',
    height: 200,
    boxShadow: '0px 0px 15px 3px red',
    '&:hover': {
      boxShadow: '0px 0px 30px 5px red'
    }
  },
  notlive: {
    borderRadius: '10px',
    height: 200,
    boxShadow: '0px 0px 15px 0px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      boxShadow: '0px 0px 30px 5px rgba(0, 0, 255, 0.7)'
    }
  },
  loadingTitle: {
    fontFamily: 'Noto Sans KR',
    fontSize: 40,
    fontWeight: 580
  }
}));

export interface ContractedCreatorListData<T> {
  creatorTwitchId: T;
  creatorName: T;
  creatorLogo: T;
}

function CreatorList(): JSX.Element {
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
                {textSource.heroSector.creatorList.content.split('\n').map((row) => (
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
          {!ContractedCreatorList.loading && !LiveCreatorList.loading && LiveCreatorList.data
            && ContractedCreatorList.data.map((row) => (
              <Grid item xs={12} sm={5} md={2} className={classes.listWrapper} key={shortid.generate()}>
                <Card profile className={LiveCreatorList.data.includes(row.creatorTwitchId) ? (classes.live) : (classes.notlive)}>
                  <CardAvatar profile>
                    <a href={`https://www.twitch.tv/${row.creatorTwitchId}`}>
                      <img src={row.creatorLogo} alt="creatorLogo" />
                    </a>
                  </CardAvatar>
                  <CardBody profile>
                    {LiveCreatorList.data.includes(row.creatorTwitchId) && (
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

export default CreatorList;
