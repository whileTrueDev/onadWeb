import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Divider
} from '@material-ui/core';
import Fingerprint from '@material-ui/icons/Fingerprint';
import CustomCard from '../../components/NewCreates/CustomCard';
import useFetchData from '../../utils/lib/hooks/useFetchData';
import ShowUrl from './ShowUrl';
import StyledItemText from '../../components/NewCreates/StyledItemText';
import StyledInput from '../../components/NewCreates/StyledInput';

const useStyles = makeStyles(theme => ({
  link: {
    fontSize: '15px',
    fontWeight: '700'
  },
  line: {
    alignItems: 'center'
  },
  boundary: {
    marginBotton: theme.spacing(4)
  }
}));

const UrlCard = () => {
  const classes = useStyles();
  const [landingUrl, setLandingUrl] = useState('');
  const overlayUrlData = useFetchData('/api/dashboard/creator/overlayUrl');
  const landingUrlData = useFetchData('/api/dashboard/creator/landingUrl');

  useEffect(() => {
    setLandingUrl(landingUrlData.payload);
  }, [landingUrlData]);

  return (
    <CustomCard iconComponent={<Fingerprint />}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <StyledItemText primary="배너 오버레이 URL" secondary="광고 송출용 URL을 보여줍니다. 방송 도구에 등록하세요." style={{ width: '100%' }} />
            </Grid>
            <Grid item>
              <ShowUrl urlData={overlayUrlData} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Divider variant="middle" component="hr" />
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <StyledItemText primary="랜딩페이지 URL" secondary="랜딩페이지용 URL을 보여줍니다. 당신의 채널 페이지에 등록하세요." />
            </Grid>
            <Grid item xs={12}>
              <Grid container direction="row" spacing={1} className={classes.line}>
                <Grid item>
                  <StyledInput
                    className={classes.textField}
                    id="overlayUrl"
                    value={landingUrl || ''}
                    inputprops={{
                      readOnly: true,
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item className={classes.line}>
                  <Link href={landingUrl} target="_blank" rel="noopener" className={classes.link}>
                    {/* <KeyBoardTab /> */}
                    {'바로가기'}
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item />

      </Grid>
    </CustomCard>
  );
};

export default UrlCard;
