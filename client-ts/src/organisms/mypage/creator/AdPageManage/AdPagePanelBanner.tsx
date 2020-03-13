
import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import FlightTakeoff from '@material-ui/icons/FlightTakeoff';
import Help from '@material-ui/icons/Help';
import InsertLinkOutlined from '@material-ui/icons/InsertLinkOutlined';

import CustomCard from '../../../../atoms/CustomCard';
import StyledItemText from '../../../../atoms/StyledItemText';
import StyledInput from '../../../../atoms/StyledInput';
import Button from '../../../../atoms/CustomButtons/Button';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';
import Tooltip from '../../../../atoms/DescPopover';
import AdPageData from './AdPageData.interfece';
// hooks
import useTooltip from '../../../../utils/hooks/useTooltip';
import useOpenValue from '../../../../utils/hooks/useOpenValue';
import copyToClipboard from '../../../../utils/copyToClipboard';


const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
  },
  images: {
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    maxWidth: 320,
  },
  site: {
    color: theme.palette.primary.main,
  }
}));

interface AdPagePanelBannerProps {
  userData: AdPageData;
}
export default function AdPagePanelBanner({
  userData
}: AdPagePanelBannerProps): JSX.Element {
  const classes = useStyles();
  const snack = useOpenValue();
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
            <div>
              <StyledInput
                className={classes.site}
                style={{ cursor: 'default' }}
                id="ad-page-url"
                value={`https://l.onad.io/${userData.creatorTwitchId}`}
                inputProps={{ readOnly: true }}
              />
              <Button
                onClick={(e): void => {
                  copyToClipboard(e, 'ad-page-url', () => {
                    snack.handleOpen();
                  });
                }}
                size="small"
              >
                <InsertLinkOutlined />
                복사
              </Button>
            </div>
          </div>

          <div>
            <div className={classes.flex}>
              <Typography variant="h6">
                기본 이미지
              </Typography>
              <div
                onMouseEnter={(evt): void => handleTooltipOpen(evt, 3)}
                onMouseLeave={handleTooltipClose}
              >
                <Help
                  fontSize="small"
                  color="disabled"
                  aria-owns={anchorEl ? 'send-desc-popover' : undefined}
                  aria-haspopup="true"
                />
              </div>
            </div>

            <div className={classnames(classes.flex, classes.images)}>
              <div>
                <a href="/pngs/landing/onad_panel_banner_default.png" download="onad_panel_banner_default">
                  <img src="/pngs/landing/onad_panel_banner_default.png" alt="패널기본배너1" className={classes.image} />
                </a>
              </div>

              <div>
                <a href="/pngs/landing/onad_panel_banner_default_third.png" download="onad_panel_banner_default2">
                  <img src="/pngs/landing/onad_panel_banner_default_third.png" alt="패널기본배너2" className={classes.image} />
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
        color="success"
        message="클립보드에 복사되었어요!"
        open={snack.open}
        onClose={snack.handleClose}
      />
    </CustomCard>
  );
}
