import { CircularProgress, makeStyles, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import * as React from 'react';
import OnadBanner from '../../../../atoms/banner/onadBanner';
import CustomDialog from '../../../../atoms/dialog/dialog';
import { useMarketerCampaign } from '../../../../utils/hooks/query/useMarketerCampaign';
import CampaignDetail from '../adManage/campaign/sub/campaignDetail';

const useStyles = makeStyles(theme => ({
  bold: { fontWeight: theme.typography.fontWeightBold },
  linkUrl: {
    display: 'inline-block',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  center: {
    textAlign: 'center',
  },
  article: { marginTop: theme.spacing(2) },
}));

interface CampaignDetailDialogProps {
  open: boolean;
  onClose: () => void;
  campaignId: string;
}

export default function CampaignDetailDialog({
  open,
  onClose,
  campaignId,
}: CampaignDetailDialogProps): React.ReactElement {
  const classes = useStyles();
  const campaign = useMarketerCampaign(campaignId);

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs" fullWidth title="캠페인 정보">
      <div>
        {campaign.isLoading && (
          <div className={classes.center}>
            <CircularProgress />
          </div>
        )}
        {!campaign.isLoading && campaign.data && (
          <>
            <CampaignDetail campaign={campaign.data} />

            <article className={classes.article}>
              <Typography className={classes.bold}>배너이미지</Typography>
              <OnadBanner src={campaign.data.bannerSrc} />
            </article>
          </>
        )}
        {!campaign.isLoading && !campaign.data && (
          <Alert severity="error">
            <Typography>{`${campaignId} 캠페인은 삭제 처리되어 정보를 불러올 수 없습니다.`}</Typography>
          </Alert>
        )}
      </div>
    </CustomDialog>
  );
}
