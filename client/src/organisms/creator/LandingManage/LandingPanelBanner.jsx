
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import FlightTakeoff from '@material-ui/icons/FlightTakeoff';
import Help from '@material-ui/icons/Help';
import CustomCard from '../../../atoms/CustomCard';
import StyledItemText from '../../../atoms/StyledItemText';
import Tooltip from '../../../atoms/DescPopover';
import useTooltip from '../../../utils/lib/hooks/useTooltip';

const useStyles = makeStyles(() => ({
  flex: {
    display: 'flex',

  },
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
            <div className={classes.flex}>
              <Typography variant="h6">
              기본 이미지
              </Typography>
              <Help
                fontSize="small"
                color="disabled"
                onMouseEnter={evt => handleTooltipOpen(evt, 3)}
                onMouseLeave={handleTooltipClose}
                aria-owns={anchorEl ? 'send-desc-popover' : undefined}
                aria-haspopup="true"
              />
            </div>

            <a href="/pngs/landing/onad_panel_banner_default.png" download>
              <img src="/pngs/landing/onad_panel_banner_default.png" alt="패널기본배너1" />
            </a>

            <a href="/pngs/landing/onad_panel_banner_default_black.png" download>
              <img src="/pngs/landing/onad_panel_banner_default_black.png" alt="패널기본배너2" />
            </a>

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
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      />
    </CustomCard>
  );
}

LandingPanelBanner.propTypes = {
  userData: PropTypes.object
};
