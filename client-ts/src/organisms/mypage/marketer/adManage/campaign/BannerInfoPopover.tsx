import moment from 'moment';
import {
  makeStyles,
  Paper, Popover, Typography,
} from '@material-ui/core';
import React from 'react';
import { CampaignInterface } from '../../dashboard/interfaces';
import { BannerDataInterface } from '../interface';
import OnadBanner from '../../../../../atoms/Banner/OnadBanner';
import renderBannerConfirmState, { CONFIRM_STATE_REJECTED } from '../../../../../utils/render_funcs/renderBannerConfirmState';

const useStyles = makeStyles((theme) => ({
  container: { padding: theme.spacing(2), minWidth: 350, minHeight: 200 }
}));
export interface BannerInfoPopoverProps {
  open: boolean;
  anchorEl: HTMLElement;
  onClose: () => void;
  selectedCampaign?: CampaignInterface;
  selectedBanner?: BannerDataInterface;
}
export default function BannerInfoPopover({
  open,
  anchorEl,
  onClose,
  selectedCampaign,
  selectedBanner,
}: BannerInfoPopoverProps): JSX.Element {
  const classes = useStyles();


  return (
    <Popover
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
    >
      <Paper className={classes.container}>
        {!selectedCampaign && selectedBanner && (
          <div>
            <OnadBanner src={selectedBanner.bannerSrc} alt="" />
            <Typography variant="body2">
              {`배너 이름: ${selectedBanner.bannerId}`}
            </Typography>
            <Typography variant="body2">
              {'심의 상태: '}
              <Typography variant="body2" component="span" color={selectedBanner.confirmState === CONFIRM_STATE_REJECTED ? 'error' : 'textPrimary'}>
                {renderBannerConfirmState(selectedBanner.confirmState)}
              </Typography>
            </Typography>
            <Typography variant="body2">
              {`생성 날짜: ${moment(selectedBanner.regiDate).format('YYYY/MM/DD HH:mm:ss')}`}
            </Typography>
          </div>
        )}
        {!selectedBanner && selectedCampaign && (
        <div>
          <OnadBanner src={selectedCampaign.bannerSrc} alt="" />
          <Typography variant="body2">
            {`배너 이름: ${selectedCampaign.bannerId}`}
          </Typography>
          {selectedCampaign.linkId && selectedCampaign.linkConfirmState && (
          <Typography variant="body2">
            {'심의 상태: '}
            <Typography variant="body2" component="span" color={selectedCampaign.linkConfirmState === CONFIRM_STATE_REJECTED ? 'error' : 'textPrimary'}>
              {renderBannerConfirmState(selectedCampaign.linkConfirmState)}
            </Typography>
          </Typography>
          )}
          <Typography variant="body2">
            {`생성 날짜: ${moment(selectedCampaign.bannerRegiDate).format('YYYY/MM/DD HH:mm:ss')}`}
          </Typography>
        </div>
        )}
      </Paper>
    </Popover>
  );
}
