import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Grid
} from '@material-ui/core';
import Countup from 'react-countup';
import useGetRequest from '../../../../../utils/hooks/useGetRequest';
import { ContractedCreatorListData } from '../../../../../pages/main/CreatorList';

const useStyles = makeStyles((theme) => ({
  container: {
    background: 'linear-gradient(60deg, #0D93BF 30%, #3154EB 90%)',
    width: '100%',
    height: '500px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 40,
    [theme.breakpoints.down('xs')]: {
      height: 'auto'
    },
  },
  wrapper: {
    width: '70%',
    border: '2px solid white',
    padding: '0px 60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: '10px 40px',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      padding: '8px 30px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '7px 20px',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '6px 15px',
    },
  },
  itemSub: {
    fontWeight: 550,
    fontFamily: 'Noto sans KR',
    fontSize: 20
  },
  date: {
    fontFamily: 'S-CoreDream-7Heavy',
    [theme.breakpoints.down('md')]: {
      fontSize: '1.2em'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1em'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8',
    },
  },
  title: {
    fontWeight: 600,
    fontFamily: 'Noto sans KR',
    marginBottom: 30,
    marginTop: 10,
    [theme.breakpoints.down('md')]: {
      fontSize: '30px'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '25px'
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 20,
      textAlign: 'center',
      fontSize: '20px',
      wordBreak: 'keep-all'
    },
  },
  innerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  itemTitle: {
    fontWeight: 600,
    fontFamily: 'Noto Sans KR',
    fontSize: 30,
    [theme.breakpoints.down('md')]: {
      fontSize: 20
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 20
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
      wordBreak: 'keep-all'
    },
  }
}));

interface BannerViewData {
  bannerView: number;
}

interface BannerClickData {
  bannerClick: number;
}

function Indicator(): JSX.Element {
  const classes = useStyles();
  const updateTime = new Date().toLocaleDateString();
  const BannerView = useGetRequest<null, BannerViewData>('/banners/impression');
  const BannerClick = useGetRequest<null, BannerClickData>('/banners/click');
  const ContractedCreator = useGetRequest<null, ContractedCreatorListData<string>[]>('/creators');

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>
        현재 온애드의 크리에이터는
      </h2>
      <div className={classes.wrapper}>
        <Grid container className={classes.innerWrapper}>
          <Grid item className={classes.item}>
            <h4 className={classes.itemTitle}>배너 노출</h4>
            {!BannerView.loading && !BannerClick.loading && !ContractedCreator.loading
              && BannerView.data && BannerClick.data && ContractedCreator.data
              && (
                <h3 className={classes.itemTitle}>
                  &#43;&nbsp;
                  <Countup duration={2} end={BannerView.data.bannerView} separator="," />
                  <span className={classes.itemSub}>&nbsp;회</span>
                </h3>
              )}
          </Grid>
          <Grid item className={classes.item}>
            <h4 className={classes.itemTitle}>계약 크리에이터</h4>
            {!ContractedCreator.loading && ContractedCreator.data && (
              <h3 className={classes.itemTitle}>
                &#43;&nbsp;
                <Countup duration={2} end={ContractedCreator.data.length} separator="," />
                <span className={classes.itemSub}>&nbsp;명</span>
              </h3>
            )}
          </Grid>
          <Grid item className={classes.item}>
            <h4 className={classes.itemTitle}>배너 클릭</h4>
            {!BannerClick.loading && BannerClick.data && (
              <h3 className={classes.itemTitle}>
                &#43;&nbsp;
                <Countup duration={2} end={BannerClick.data.bannerClick} separator="," />
                <span className={classes.itemSub}>&nbsp;회</span>
              </h3>
            )}
          </Grid>
        </Grid>
        <h4 className={classes.date}>
          {`UPDATE : ${updateTime}`}
        </h4>
      </div>
    </div>
  );
}

export default Indicator;
