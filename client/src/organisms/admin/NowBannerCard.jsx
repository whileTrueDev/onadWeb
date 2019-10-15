import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Grid, Paper
} from '@material-ui/core';
import Video from './Video';
import useFetchData from '../../utils/lib/hooks/useFetchData';
import CircularProgress from '../../atoms/Progress/CircularProgress';
import CustomCard from '../../atoms/CustomCard';
import StyledItemText from '../../atoms/StyledItemText';
import Card from '../../atoms/Card/Card';
import CardAvatar from '../../atoms/Card/CardAvatar';
import CardBody from '../../atoms/Card/CardBody';


const useStyles = makeStyles(theme => ({
  banner: {
    padding: theme.spacing(1),
    backgroundColor: '#eeeeee',
    width: '400px',
    height: '200px'
  },
  cardTitle: {
    color: '#3C4858',
    textAlign: 'center',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '700',
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontWeight: '400',
      lineHeight: '1',
    },
  },
  container: {
    marginTop: theme.spacing(2)
  }
}));

const NowBannerCard = () => {
  const classes = useStyles();
  const bannerData = useFetchData('/api/admin/banners');
  return (
    <CustomCard iconComponent={<StyledItemText primary="현재 게시 중인 배너" style={{ color: '#FFF' }} />}>
      <Grid container direction="row" spacing={1} justify="center" className={classes.container}>
        {bannerData.loading && (<CircularProgress small />)}
        {!bannerData.loading && !bannerData.error && (
          bannerData.payload.map(banner => (
            <Grid item key={banner.campaignId}>
              <Card profile>
                <CardAvatar profile>
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                    <img src={banner.creatorLogo} alt="..." />
                  </a>
                </CardAvatar>
                <CardBody profile>
                  <h4 className={classes.cardTitle}>
                    {`${banner.creatorName}`}
                  </h4>
                  <Paper className={classes.banner}>
                    <img src={banner.bannerSrc} alt="banner" style={{ width: '100%', height: '100%' }} />
                  </Paper>
                </CardBody>
              </Card>
            </Grid>
          )))
      }
      </Grid>
    </CustomCard>
  );
};

export default NowBannerCard;
