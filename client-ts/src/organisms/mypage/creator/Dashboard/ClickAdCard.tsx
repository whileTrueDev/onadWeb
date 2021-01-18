import React from 'react';
import classnames from 'classnames';
import {
  Grid, Typography, Divider, Paper, makeStyles
} from '@material-ui/core';
// components
import AdLevelSlider from '../../../../atoms/AdLevelSlider';
// utils
import numFormatter from '../../../../utils/numFormatter';
import history from '../../../../history';

const useStyles = makeStyles((theme) => ({
  flex: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  container: {
    padding: theme.spacing(4), marginTop: theme.spacing(1), height: 280, overflowY: 'auto'
  },
  right: { textAlign: 'right' },
  slider: { cursor: 'default', maxWidth: 250 },
  bold: { fontWeight: 'bold' },
  text: { textTransform: 'none' },
  moreButton: {
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline', }
  },
}));

export interface ClicksRes { adpanel: number; adchat: number }
export interface LevelRes { creatorId: string; level: number; exp: number }

interface ClickAdCardProps { clicksData: ClicksRes; levelData: LevelRes }
const ClickAdCard = ({
  clicksData, levelData
}: ClickAdCardProps): JSX.Element => {
  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      {/* 제목 */}
      <div>
        <Typography className={classes.bold}>
          클릭광고 현황
        </Typography>
        <Typography variant="caption">
          내 광고관리 탭에서 자세히 확인할 수 있습니다.
        </Typography>
      </div>

      <div className={classes.right}>
        <Typography>내 광고레벨</Typography>
        <Typography gutterBottom variant="h4" className={classes.bold}>
          {`LV. ${levelData.level}`}
        </Typography>
        <AdLevelSlider
          valueLabelFormat={(x): string => `광고 경험치: ${x}`}
          className={classes.slider}
          max={500}
          valueLabelDisplay="auto"
          aria-label="pretto slider creator-ad-level"
          value={levelData.exp}
        />
      </div>
      <Grid container direction="row" justify="space-evenly">
        <Grid item>
          <div className={classes.flex}>
            <Typography gutterBottom variant="body1">채팅광고 클릭</Typography>
          </div>
          <div className={classes.flex}>
            <Typography gutterBottom variant="h5" className={classnames(classes.text, classes.bold)}>
              {`${numFormatter(clicksData.adchat ? clicksData.adchat : 0)} 회`}
            </Typography>
          </div>
        </Grid>

        <Grid item>
          <Divider component="hr" orientation="vertical" />
        </Grid>

        <Grid item>
          <div className={classes.flex}>
            <Grid item>
              <Typography gutterBottom variant="body1">패널광고 클릭</Typography>
            </Grid>
          </div>
          <div className={classes.flex}>
            <Typography gutterBottom variant="h5" className={classnames(classes.text, classes.bold)}>
              {`${numFormatter(clicksData.adpanel ? clicksData.adpanel : 0)} 회`}
            </Typography>
          </div>
        </Grid>
      </Grid>
      <div className={classes.right}>
        <Typography
          className={classes.moreButton}
          variant="caption"
          color="textSecondary"
          onClick={(): void => { history.push('/mypage/creator/ad'); }}
        >
          자세히 보기
        </Typography>
      </div>
    </Paper>
  );
};

export default ClickAdCard;
