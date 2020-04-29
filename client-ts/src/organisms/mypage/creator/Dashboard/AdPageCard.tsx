import React from 'react';
import {
  Grid, Typography, Divider
} from '@material-ui/core';
import { BarChart } from '@material-ui/icons';
// components
import CustomCard from '../../../../atoms/CustomCard';
import PrettoSlider from '../../../../atoms/PrettoSlider';
import StyledItemText from '../../../../atoms/StyledItemText';
// style
import useLandingCardStyles from './AdPageCard.style';
// utils
import numFormatter from '../../../../utils/numFormatter';

export interface ClicksRes { adpanel: number; adchat: number }
export interface LevelRes { creatorId: string; level: number; exp: number }

interface AdPageCardProps { clicksData: ClicksRes; levelData: LevelRes }
const AdPageCard = ({
  clicksData, levelData
}: AdPageCardProps): JSX.Element => {
  const classes = useLandingCardStyles();

  return (
    <CustomCard
      iconComponent={<BarChart />}
      buttonComponent={(
        <StyledItemText primary="클릭광고 현황" secondary="자세한 사항은 내 클릭광고 탭에서 확인하세요." />
      )}
    >
      <Grid container direction="column" spacing={2}>
        <Grid item style={{ paddingTop: 32 }}>
          <Grid container direction="row" alignItems="center" justify="center">
            <Grid item xs={12}>
              <Typography variant="body2" align="center" className={classes.level}>
                LV.
                {' '}
                {levelData.level}
              </Typography>
              <PrettoSlider
                style={{ cursor: 'default' }}
                max={500}
                valueLabelDisplay="on"
                aria-label="pretto slider creator-ad-level"
                value={levelData.exp}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid container direction="row" justify="space-evenly">
          <Grid item>
            <div className={classes.flex}>
              <Typography gutterBottom variant="body1" className={classes.head}>총 클릭 수</Typography>
            </div>
            <div className={classes.flex}>
              <Typography gutterBottom variant="h5">
                {`${numFormatter(
                  ((clicksData.adchat ? clicksData.adchat : 0)
                    + (clicksData.adpanel ? clicksData.adpanel : 0))
                )} `}
              </Typography>
              <Typography gutterBottom variant="body2" className={classes.unit}>
                회
              </Typography>
            </div>
          </Grid>
          <Grid item>
            <Divider component="hr" orientation="vertical" />
          </Grid>
          <Grid item>
            <div className={classes.flex}>
              <Typography gutterBottom variant="body1" className={classes.head}>채팅광고 클릭</Typography>
            </div>
            <div className={classes.flex}>
              <Typography gutterBottom variant="h5">
                {`${numFormatter(clicksData.adchat ? clicksData.adchat : 0)} `}
              </Typography>
              <Typography gutterBottom variant="body2" className={classes.unit}>
                회
              </Typography>
            </div>
          </Grid>
          <Grid item>
            <Divider component="hr" orientation="vertical" />
          </Grid>
          <Grid item>
            <Grid container className={classes.flex}>
              <Grid item>
                <Typography gutterBottom variant="body1" className={classes.head}>패널광고 클릭</Typography>
              </Grid>
            </Grid>
            <div className={classes.flex}>
              <Typography gutterBottom variant="h5">
                {`${numFormatter(clicksData.adpanel ? clicksData.adpanel : 0)} `}
              </Typography>
              <Typography gutterBottom variant="body2" className={classes.unit}>
                회
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </CustomCard>
  );
};

export default AdPageCard;
