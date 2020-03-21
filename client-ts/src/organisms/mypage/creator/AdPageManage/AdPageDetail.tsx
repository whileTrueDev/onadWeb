import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Typography, Divider
} from '@material-ui/core';
import BarChart from '@material-ui/icons/BarChart';
import CustomCard from '../../../../atoms/CustomCard';
import PrettoSlider from '../../../../atoms/PrettoSlider';
import StyledItemText from '../../../../atoms/StyledItemText';
import Tooltip from '../../../../atoms/DescPopover';
import useTooltip from '../../../../utils/hooks/useTooltip';
import AdPageData from './AdPageData.interfece';

const useStyles = makeStyles(() => ({
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  head: { fontWeight: 500, },
  unit: { fontWeight: 700, marginLeft: '3px' },
  level: { fontWeight: 700, marginLeft: '3px' }
}));

interface AdPageDetailProps {
  userData: AdPageData;
}
const AdPageDetail = ({
  userData
}: AdPageDetailProps): JSX.Element => {
  const classes = useStyles();
  const {
    tooltipIndex, anchorEl, handleTooltipClose, handleTooltipOpen
  } = useTooltip();

  return (
    <CustomCard
      iconComponent={(<BarChart />)}
      buttonComponent={<StyledItemText primary="광고페이지 현황" secondary="광고페이지의 상호작용에 따라 레벨이 결정됩니다." />}
    >
      <Grid container direction="column" spacing={2}>
        <Grid item />
        <Grid item />
        <Grid item>
          <Grid
            container
            direction="row"
            style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onMouseEnter={(evt): void => handleTooltipOpen(evt, 2)}
            onMouseLeave={handleTooltipClose}
            aria-owns={anchorEl ? 'send-desc-popover' : undefined}
            aria-haspopup="true"
          >
            <Grid item xs={11} sm={11}>
              <PrettoSlider
                max={500}
                style={{ cursor: 'default' }}
                valueLabelDisplay="on"
                aria-label="pretto slider"
                value={userData.exp}
              />
            </Grid>

            <Grid item>
              <Typography gutterBottom variant="body2" className={classes.level}>
                {`LV. ${userData.level}`}
              </Typography>
            </Grid>

          </Grid>
        </Grid>


        <Grid container direction="row" justify="space-evenly">
          <Grid item>
            <div className={classes.flex}>
              <Typography gutterBottom variant="body1" className={classes.head}>총 방문수</Typography>
            </div>
            <div className={classes.flex}>
              <Typography gutterBottom variant="h5">
                {`${userData.visitCount} `}
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
              <Typography gutterBottom variant="body1" className={classes.head}>총 배너 클릭수</Typography>
            </div>
            <div className={classes.flex}>
              <Typography gutterBottom variant="h5">
                {`${userData.clickCount} `}
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
                <Typography gutterBottom variant="body1" className={classes.head}>총 구매 이동수</Typography>
              </Grid>
            </Grid>
            <div className={classes.flex}>
              <Typography gutterBottom variant="h5">
                {`${userData.transferCount} `}
              </Typography>
              <Typography gutterBottom variant="body2" className={classes.unit}>
                회
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Tooltip
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handlePopoverClose={handleTooltipClose}
        descIndex={tooltipIndex}
        contentType="landingManage"
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      />

    </CustomCard>
  );
};

export default AdPageDetail;
