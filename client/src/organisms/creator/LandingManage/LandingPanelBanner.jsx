
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import FlightTakeoff from '@material-ui/icons/FlightTakeoff';
import Help from '@material-ui/icons/Help';
import InsertLinkOutlined from '@material-ui/icons/InsertLinkOutlined';

import CustomCard from '../../../atoms/CustomCard';
import StyledItemText from '../../../atoms/StyledItemText';
import StyledInput from '../../../atoms/StyledInput';
import Button from '../../../atoms/CustomButtons/Button';
import Snackbar from '../../../atoms/Snackbar/Snackbar';
import Tooltip from '../../../atoms/DescPopover';
import useTooltip from '../../../utils/lib/hooks/useTooltip';
import useOpenValue from '../../../utils/lib/hooks/useOpenValue';

const useStyles = makeStyles(() => ({
  flex: {
    display: 'flex',
  },
  images: {
    flexDirection: 'column',
  },
  site: {
    color: '#00acc1',
  }
}));

export default function LandingPanelBanner(props) {
  const classes = useStyles();
  const { userData } = props;
  const snack = useOpenValue();
  const {
    tooltipIndex, anchorEl, handleTooltipOpen, handleTooltipClose
  } = useTooltip();

  // 클립보드에 카피 함수
  const copyToClipboard = (e) => {
    e.preventDefault();
    const landingUrl = document.getElementById('landing_url');
    landingUrl.select();
    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    e.target.focus();
    snack.handleOpen();
  };

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
            <div>
              { !userData.loading && userData.payload && (
                <div>
                  <StyledInput
                    className={classes.site}
                    style={{ cursor: 'default' }}
                    id="landing_url"
                    value={`https://l.onad.io/${userData.payload.creatorTwitchId}`}
                    inputprops={{
                      readOnly: true,
                    }}
                    variant="outlined"
                  />
                  <Button onClick={copyToClipboard} size="small">
                    <InsertLinkOutlined />
                    복사
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className={classes.flex}>
              <Typography variant="h6">
                기본 이미지
              </Typography>
              <Help
                fontSize="small"
                color="disabled"
                onMouseEnter={(evt) => handleTooltipOpen(evt, 3)}
                onMouseLeave={handleTooltipClose}
                aria-owns={anchorEl ? 'send-desc-popover' : undefined}
                aria-haspopup="true"
              />
            </div>

            <div className={classnames(classes.flex, classes.images)}>
              <div>
                <a href="/pngs/landing/onad_panel_banner_default.png" download="onad_panel_banner_default">
                  <img src="/pngs/landing/onad_panel_banner_default.png" alt="패널기본배너1" />
                </a>
              </div>

              <div>
                <a href="/pngs/landing/onad_panel_banner_default_third.png" download="onad_panel_banner_default2">
                  <img src="/pngs/landing/onad_panel_banner_default_third.png" alt="패널기본배너2" />
                </a>
              </div>
            </div>
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

      <Snackbar
        place="bc"
        color="success"
        icon
        message="클립보드에 복사되었어요!"
        open={snack.open}
        closeNotification={snack.handleClose}
        handleClose={snack.handleClose}
      />
    </CustomCard>
  );
}

LandingPanelBanner.propTypes = {
  userData: PropTypes.object
};
