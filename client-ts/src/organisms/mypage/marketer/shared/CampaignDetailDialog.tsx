import { CircularProgress, makeStyles, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import OnadBanner from '../../../../atoms/Banner/OnadBanner';
import CustomDialog from '../../../../atoms/Dialog/Dialog';
import { useGetRequest } from '../../../../utils/hooks';
import CampaignDetail from '../adManage/campaign/sub/CampaignDetail';
import { CampaignInterface } from '../dashboard/interfaces';

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
  const campaignData = useGetRequest<{ campaignId: string }, CampaignInterface>(
    '/marketer/campaign',
    { campaignId },
  );

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs" fullWidth title="캠페인 정보">
      <div>
        {campaignData.loading && (
          <div className={classes.center}>
            <CircularProgress />
          </div>
        )}
        {!campaignData.loading && campaignData.data && (
          <>
            <CampaignDetail campaign={campaignData.data} />

            <article className={classes.article}>
              <Typography className={classes.bold}>배너이미지</Typography>
              <OnadBanner src={campaignData.data.bannerSrc} />
            </article>
          </>
        )}
        {!campaignData.loading && !campaignData.data && (
          <Alert severity="error">
            <Typography>{`${campaignId} 캠페인은 삭제 처리되어 정보를 불러올 수 없습니다.`}</Typography>
          </Alert>
        )}
      </div>
    </CustomDialog>
  );
}
