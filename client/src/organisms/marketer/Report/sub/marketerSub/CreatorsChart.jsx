import React from 'react';
import {
  Grid, Avatar, Chip, Typography
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ReChartPie from '../../../../../atoms/Chart/ReChartPie';

const useStyles = makeStyles(theme => ({
  chip: {
    margin: theme.spacing(0.5)
  }
}));

export default function CustomPieChart(props) {
  const classes = useStyles();
  const { creatorsData } = props;

  const [activeIndex, setActiveIndex] = React.useState(0);
  const onPieEnter = (d, index) => {
    setActiveIndex(index);
  };

  return (
    <Grid container>
      <Grid item xs={12} lg={6}>

        {!creatorsData.loading && creatorsData.payload.length > 0 && (
          <ReChartPie
            activeIndex={activeIndex}
            onPieEnter={onPieEnter}
            data={creatorsData.payload.slice(0, 50)}
            height={400}
            nameKey="creatorName"
            dataKey="total_ad_exposure_amount"
          />
        )}
      </Grid>

      <Grid item xs={12} lg={6} style={{ overflow: 'hidden' }}>
        {!creatorsData.loading && creatorsData.payload && (
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="caption">* 아이콘 클릭시 해당 크리에이터의 채널로 이동됩니다.</Typography>
            </Grid>
            {creatorsData.payload.slice(0, 32).map((d, index) => (
              <Chip
                key={d.creatorName}
                variant="outlined"
                className={classes.chip}
                label={`${index + 1}. ${d.creatorName}`}
                avatar={<Avatar alt={d.creatorName} src={d.creatorLogo} />}
                onMouseEnter={() => {
                  setActiveIndex(index);
                }}
                onClick={() => { window.open(`https://twitch.tv/${d.creatorTwitchId}`); }}
              />
            ))}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
