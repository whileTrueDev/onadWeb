import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Grid } from '@material-ui/core';
import Fingerprint from '@material-ui/icons/Fingerprint';
import CustomCard from '../../../atoms/CustomCard';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import ShowUrl from './ShowUrl';
import StyledItemText from '../../../atoms/StyledItemText';
import CircularProgress from '../../../atoms/Progress/CircularProgress';

const useStyles = makeStyles(theme => ({
  urlSection: {
    padding: theme.spacing(3)
  }
}));

const UrlCard = () => {
  const classes = useStyles();
  const overlayUrlData = useFetchData('/api/dashboard/creator/overlayUrl');

  return (
    <CustomCard iconComponent={<Fingerprint />}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <StyledItemText primary="배너 오버레이 URL" secondary="광고 송출용 URL을 보여줍니다. 방송 도구에 등록하세요." style={{ width: '100%' }} />
            </Grid>
            <Grid item>
              { overlayUrlData.loading && (<CircularProgress />)}
              { !overlayUrlData.loading && (
                <div className={classes.urlSection}>
                  <ShowUrl urlData={overlayUrlData} />
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CustomCard>
  );
};

export default UrlCard;
