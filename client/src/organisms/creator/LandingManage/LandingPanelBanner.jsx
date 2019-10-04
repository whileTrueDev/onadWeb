
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import FlightTakeoff from '@material-ui/icons/FlightTakeoff';
import CustomCard from '../../../atoms/CustomCard';
import StyledItemText from '../../../atoms/StyledItemText';
import Tooltip from '../../../atoms/DescPopover';
import useTooltip from '../../../utils/lib/hooks/useTooltip';

const useStyles = makeStyles(() => ({
  site: {
    color: '#00acc1',
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer'
    }
  }
}));

export default function LandingPanelBanner(props) {
  const classes = useStyles();
  const { userData } = props;

  const {
    tooltipIndex, anchorEl, handleTooltipOpen, handleTooltipClose
  } = useTooltip();
  return (
    <CustomCard
      iconComponent={<FlightTakeoff />}
      buttonComponent={(
        <StyledItemText
          primary="트위치 패널용 온애드 기본 배너"
          secondary="광고페이지로 링크하여 광고를 더 많이 노출할 수 있습니다."
          onMouseEnter={evt => handleTooltipOpen(evt, 3)}
          onMouseLeave={handleTooltipClose}
          aria-owns={anchorEl ? 'send-desc-popover' : undefined}
          aria-haspopup="true"
        />
      )}
    >
      <Grid container>
        <Grid item xs={12}>

          <div style={{ marginBottom: 30 }}>
            <Typography variant="h6">
              광고페이지 링크
            </Typography>

            { !userData.loading && userData.payload && (
            <Typography
              className={classes.site}
              variant="body1"
              onClick={() => { window.open(`https://l.onad.io/${userData.payload.creatorTwitchId}`); }}
            >
              {`https://l.onad.io/${userData.payload.creatorTwitchId}`}

            </Typography>
            )}

          </div>

          <div>
            <Typography variant="h6">
              기본 이미지
            </Typography>

            <img src="/pngs/landing/panel_banner_default.png" alt="패널기본배너1" />
            <img src="/pngs/landing/panel_banner_default_black.png" alt="패널기본배너2" />

          </div>
        </Grid>
      </Grid>

      <Tooltip
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handlePopoverClose={handleTooltipClose}
        descIndex={tooltipIndex}
        contentType="landingManage"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      />
    </CustomCard>
  );
}
