import React from 'react';
import {
  Grid, Typography, Divider, Paper, Tooltip
} from '@material-ui/core';
// components
import AdLevelSlider from '../../../../atoms/AdLevelSlider';
// style
import useLandingCardStyles from './AdPageCard.style';
// utils
import numFormatter from '../../../../utils/numFormatter';
import history from '../../../../history';

export interface ClicksRes { adpanel: number; adchat: number }
export interface LevelRes { creatorId: string; level: number; exp: number }

interface AdPageCardProps { clicksData: ClicksRes; levelData: LevelRes }
const AdPageCard = ({
  clicksData, levelData
}: AdPageCardProps): JSX.Element => {
  const classes = useLandingCardStyles();

  return (
    <Paper style={{
      padding: 32, marginTop: 8, height: 280, overflowY: 'auto'
    }}
    >
      {/* 제목 */}
      <div>
        <Typography style={{ fontWeight: 'bold' }}>
          클릭광고 현황
        </Typography>
        <Typography variant="caption">
          내 클릭광고 탭에서 자세히 확인할 수 있습니다.
        </Typography>
      </div>

      <div style={{ textAlign: 'right', }}>
        <Typography>내 광고레벨</Typography>
        <Typography gutterBottom variant="h4" style={{ fontWeight: 'bold', }}>
          {`LV. ${levelData.level}`}
        </Typography>
        <AdLevelSlider
          valueLabelFormat={(x): string => `광고 경험치: ${x}`}
          style={{ cursor: 'default', maxWidth: 250 }}
          max={500}
          valueLabelDisplay="auto"
          aria-label="pretto slider creator-ad-level"
          value={levelData.exp}
        />
      </div>
      <Grid container direction="row" justify="space-evenly">
        <Grid item>
          <div className={classes.flex}>
            <Typography gutterBottom variant="body1" className={classes.head}>채팅광고 클릭</Typography>
          </div>
          <div className={classes.flex}>
            <Typography gutterBottom variant="h5" style={{ textTransform: 'none' }}>
              {clicksData.adchat.toLocaleString()}
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
          <div className={classes.flex}>
            <Grid item>
              <Typography gutterBottom variant="body1" className={classes.head}>패널광고 클릭</Typography>
            </Grid>
          </div>
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
      <div style={{ textAlign: 'right', margin: '16px 8px 8px', overflowY: 'auto' }}>
        <Typography
          variant="caption"
          color="textSecondary"
          onClick={(): void => { history.push('/mypage/creator/ad-dashboard'); }}
        >
          자세히 보기
        </Typography>
      </div>
    </Paper>
  );
};

export default AdPageCard;
