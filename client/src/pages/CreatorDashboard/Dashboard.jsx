import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Paper, Typography, Divider
} from '@material-ui/core';
import BrandingWatermark from '@material-ui/icons/BrandingWatermark';
import DateRange from '@material-ui/icons/DateRange';
import CustomCard from '../../components/NewCreates/CustomCard';
import Button from '../../components/NewCreates/CustomButtons/Button';
import CircularProgress from '../../components/NewCreates/Progress/CircularProgress';
import useFetchData from '../../utils/lib/hooks/useFetchData';
import IncomCard from './IncomeCard';
import StyledItemText from '../../components/NewCreates/StyledItemText';
import UrlCard from './UrlCard';
import BannerCard from './BannerCard';
import LandingCard from './LandingCard';

const useStyles = makeStyles(_theme => ({
  stats: {
    color: '#999',
    display: 'inline-flex',
    fontSize: '14px',
    lineHeight: '22px',
    '& svg': {
      top: '4px',
      width: '16px',
      height: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      top: '4px',
      fontSize: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  head: {
    fontWeight: '500',
    color: '#455a64',
  }
}));


const Dashboard = () => {
  const classes = useStyles();

  return (
    <Grid container direction="row">
      <Grid item xs={12} sm={3}>
        {/* <Grid container direction="column" spacing={0}> */}
        <IncomCard />
        <LandingCard />
        {/* </Grid> */}
      </Grid>
      <Grid item xs={12} sm={7}>
        <div>그래프 영역</div>
      </Grid>
      <Grid item xs={12} sm={2} />
      <Grid item xs={12} sm={6}>
        <BannerCard />
      </Grid>
      <Grid item xs={12} sm={4}>
        <UrlCard />
      </Grid>
      <Grid item xs={12} sm={2} />
    </Grid>
  );
};

export default Dashboard;
