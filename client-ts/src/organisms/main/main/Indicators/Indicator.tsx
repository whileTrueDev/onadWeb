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

function Indicator(): JSX.Element {
  const classes = useStyles();
  const updateTime = new Date().toLocaleDateString();
  const BannerView = useGetRequest<null, BannerViewData[]>('/banners/impression');
  const BannerClick = useGetRequest<null, BannerClickData[]>('/banners/click');
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
                  <Countup duration={2} end={BannerView.data[0].bannerView} separator="," />
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
                <Countup duration={2} end={BannerClick.data[0].bannerClick} separator="," />
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
