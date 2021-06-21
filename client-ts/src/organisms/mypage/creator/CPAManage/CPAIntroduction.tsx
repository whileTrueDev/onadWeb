import React from 'react';
// components
import { Grid, Typography } from '@material-ui/core';
import Filter1Icon from '@material-ui/icons/Filter1';
import Filter2Icon from '@material-ui/icons/Filter2';
import Filter3Icon from '@material-ui/icons/Filter3';
import CustomCard from '../../../../atoms/CustomCard';
import StyledItemText from '../../../../atoms/StyledItemText';
// source
import textsource from './source/AgreementText';
import useStyle from './CPAAgreement.style';

export default function CPAIntroduction(): JSX.Element {
  const classes = useStyle();
  return (
    <CustomCard
      iconComponent={<StyledItemText primary="참여형 광고란?" color="white" />}
      backgroundColor
    >
      <div className={classes.text}>
        {textsource.explain.split('\n').map(text => (
          <Typography key={text}>{text}</Typography>
        ))}
      </div>
      <Grid container direction="row" spacing={1} className={classes.stepExplain} justify="center">
        <Grid item className={classes.step} xs={12} md={4} sm={4}>
          <Typography variant="body1" align="center" gutterBottom className={classes.stepWrap}>
            <Filter1Icon color="primary" fontSize="small" className={classes.stepTitle} />
            트위치 패널 설정
          </Typography>
          <img src="/pngs/cpa/pannel.png" alt="step2" className={classes.stepIMG} />
          {textsource.step.first.split('\n').map(text => (
            <Typography
              key={text}
              variant="body1"
              align="center"
              gutterBottom
              className={classes.stepDetailWrap}
            >
              {text}
            </Typography>
          ))}
        </Grid>
        <Grid item className={classes.step} xs={12} md={4} sm={4}>
          <Typography variant="body1" align="center" gutterBottom className={classes.stepWrap}>
            <Filter2Icon color="primary" fontSize="small" className={classes.stepTitle} />
            광고페이지에 광고 등록
          </Typography>
          <img src="/pngs/cpa/cpapage.png" alt="step3" className={classes.stepIMG} />
          {textsource.step.second.split('\n').map(text => (
            <Typography
              key={text}
              variant="body1"
              align="center"
              gutterBottom
              className={classes.stepDetailWrap}
            >
              {text}
            </Typography>
          ))}
        </Grid>
        <Grid item className={classes.step} xs={12} md={4} sm={4}>
          <Typography variant="body1" align="center" gutterBottom className={classes.stepWrap}>
            <Filter3Icon color="primary" fontSize="small" className={classes.stepTitle} />
            수익 발생
          </Typography>
          <img src="/pngs/cpa/income.png" alt="step1" className={classes.stepIMG} />
          {textsource.step.third.split('\n').map(text => (
            <Typography
              key={text}
              variant="body1"
              align="center"
              gutterBottom
              className={classes.stepDetailWrap}
            >
              {text}
            </Typography>
          ))}
        </Grid>
      </Grid>
    </CustomCard>
  );
}
