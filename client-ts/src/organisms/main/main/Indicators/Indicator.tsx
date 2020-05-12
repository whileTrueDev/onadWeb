import React from 'react';
import {
  Grid
} from '@material-ui/core';
import Countup from 'react-countup';
import useStyles from '../style/Indicator.style';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import { ContractedCreatorListData } from '../../../../pages/main/CreatorList';


interface BannerViewData {
  bannerView: number;
}

interface BannerClickData {
  bannerClick: number;
}

interface NowBroadcastData {
  nowBroadcast: number;
}

interface TotalFollowersData {
  totalFollowers: number;
}

function Indicator(): JSX.Element {
  const classes = useStyles();
  const updateTime = new Date().toLocaleDateString();
  const BannerView = useGetRequest<null, BannerViewData[]>('/banners/impression');
  const NowBroadcast = useGetRequest<null, NowBroadcastData[]>('/creators/broadcast');
  const ContractedCreator = useGetRequest<null, ContractedCreatorListData<string>[]>('/creators');
  const TotoalFollowers = useGetRequest<null, TotalFollowersData[]>('/creators/detail');

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>
        현재 온애드의 크리에이터는
      </h2>
      <div className={classes.wrapper}>
        <Grid container className={classes.innerWrapper}>
          <Grid item className={classes.item}>
            <h4 className={classes.itemTitle}>총 노출량</h4>
            <h3 className={classes.itemTitle}>
              {!BannerView.loading && !NowBroadcast.loading && !ContractedCreator.loading && !TotoalFollowers.loading
                && BannerView.data && NowBroadcast.data && ContractedCreator.data && TotoalFollowers.data
                && (
                  <>
                    &#43;&nbsp;
                    <Countup duration={2} end={BannerView.data[0].bannerView} separator="," />
                    <span className={classes.itemSub}>&nbsp;회</span>
                  </>
                )}
            </h3>
          </Grid>
          <Grid item className={classes.item}>
            <h4 className={classes.itemTitle}>계약 크리에이터</h4>
            <h3 className={classes.itemTitle}>
              {!BannerView.loading && !NowBroadcast.loading && !ContractedCreator.loading && !TotoalFollowers.loading
                && BannerView.data && NowBroadcast.data && ContractedCreator.data && TotoalFollowers.data
                && (
                  <>
                    &#43;&nbsp;
                    <Countup duration={2} end={ContractedCreator.data.length} separator="," />
                    <span className={classes.itemSub}>&nbsp;명</span>
                  </>
                )}
            </h3>
          </Grid>
          <Grid item className={classes.item}>
            <h4 className={classes.itemTitle}>총 팔로우</h4>
            <h3 className={classes.itemTitle}>
              {!BannerView.loading && !NowBroadcast.loading && !ContractedCreator.loading && !TotoalFollowers.loading
                && BannerView.data && NowBroadcast.data && ContractedCreator.data && TotoalFollowers.data
                && (
                  <>
                    &#43;&nbsp;
                    <Countup duration={2} end={TotoalFollowers.data[0].totalFollowers} separator="," />
                    <span className={classes.itemSub}>&nbsp;명</span>
                  </>
                )}
            </h3>
          </Grid>
          <Grid item className={classes.item}>
            <h4 className={classes.itemTitle}>현재 생방송 중</h4>
            <h3 className={classes.itemTitle}>
              {!BannerView.loading && !NowBroadcast.loading && !ContractedCreator.loading && !TotoalFollowers.loading
                && BannerView.data && NowBroadcast.data && ContractedCreator.data && TotoalFollowers.data
                && (
                  <>
                    &#43;&nbsp;
                    <Countup duration={2} end={NowBroadcast.data[0].nowBroadcast} separator="," />
                    <span className={classes.itemSub}>&nbsp;명</span>
                  </>
                )}
            </h3>
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
