import React from 'react';
import {
  Grid, ListItemText, Divider, Input
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';
import BannerCarousel from '../../components/NewCreates/BannerCarousel';
import Success from '../../components/NewCreates/Success';
import StyledItemText from '../../components/NewCreates/StyledItemText';
import StyledInput from '../../components/NewCreates/StyledInput';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: '0px',
    alignItem: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  item: {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
      marginBottom: '30px',
      padding: 0,
    },
  },
  input: {
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      fontSize: '12px',
      margin: 0,
    },
  },
  label: {
    color: '#455a64',
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      marginBottom: '8px',
    },
  },
}));

const CampaignCreate = (props) => {
  const classes = useStyles();
  const { bannerList, setCampaignName } = props;
  const [checkName, setCheckName] = React.useState(false);

  const handleChangeName = (event) => {
    if (event.target.value.length >= 3) {
      setCheckName(true);
      // 캠페인 명 조회추가해야함.. // 캠페인 명 조회 후 setCampaignName을 이용하여 상위 컴포넌트에 이름 전달.
    } else {
      setCheckName(false);
    }
  };

  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <Grid container direction="column" className={classes.item}>
          <Grid item>
            <StyledItemText primary="첫째,&nbsp;&nbsp; 캠페인 이름 입력하기" secondary="해당 광고 캠페인의 이름을 입력하세요." className={classes.label} />
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item>
                <StyledInput autoFocus className={classes.input} onChange={handleChangeName} />
              </Grid>
              <Grid item>
                {checkName
                && (
                <Success>
                  <Check />
                </Success>
                )}
              </Grid>
            </Grid>

          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="column" className={classes.item}>
          <Grid item>
            <StyledItemText primary="둘째,&nbsp;&nbsp; 배너 선택하기" secondary="해당 광고 캠페인에 사용할 배너를 선택해주세요." className={classes.label} />
            <Divider component="hr" style={{ marginBottom: '10px', width: '300px' }} />
          </Grid>
          <Grid item>
            <BannerCarousel steps={bannerList} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>

  );
};

export default CampaignCreate;
