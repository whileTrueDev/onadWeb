import { Chip, makeStyles, Paper, Tooltip, Typography } from '@material-ui/core';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import * as React from 'react';
import OnadBanner from '../../../../../../atoms/Banner/OnadBanner';
import renderOptionType from '../../../../../../utils/render_funcs/renderOptionType';
import renderPriorityType from '../../../../../../utils/render_funcs/renderPriorityType';
import { CampaignInterface } from '../../../dashboard/interfaces';

const useStyles = makeStyles(theme => ({
  metaInfo: {
    maxWidth: 320,
    marginBottom: theme.spacing(1),
  },
  title: {
    fontWeight: theme.typography.fontWeightBold,
  },
  contents: {
    display: 'grid',
    padding: theme.spacing(1, 2),
  },
}));

export interface CampaignMetaInfoCardProps {
  campaign: CampaignInterface;
  switchComponent?: React.ReactElement;
}
export default function CampaignMetaInfoCard({
  campaign,
  switchComponent,
}: CampaignMetaInfoCardProps): JSX.Element {
  const classes = useStyles();

  const dailyLimitText = useMemo(() => {
    const DAILY_LIMIT_UNLIMITED = -1;
    const dailySum = campaign.dailysum ? campaign.dailysum.toLocaleString() : 0;
    if (campaign.dailyLimit !== DAILY_LIMIT_UNLIMITED) {
      return `오늘 집행 ${dailySum}원 • 일예산 ${new Intl.NumberFormat().format(
        campaign.dailyLimit,
      )}원 `;
    }
    return `오늘 집행 ${dailySum}원`;
  }, [campaign.dailyLimit, campaign.dailysum]);

  return (
    <Paper id="meta-info" className={classes.metaInfo} variant="outlined">
      <OnadBanner src={campaign.bannerSrc} width="100%" height="100%" />

      <div className={classes.contents}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Chip
            size="small"
            label={campaign.onOff ? '활성화상태' : '비활성화상태'}
            color={campaign.onOff ? 'primary' : 'default'}
          />
          {switchComponent || null}
        </div>
        <Typography className={classes.title}>{campaign.campaignName}</Typography>
        <Typography variant="body2" noWrap>
          {`${renderOptionType(campaign.optionType)} • ${renderPriorityType(
            campaign.priorityType,
          )}`}
        </Typography>

        {campaign.dailyLimit !== -1 ? (
          <Tooltip title={dailyLimitText}>
            <Typography variant="body2" noWrap>
              {dailyLimitText}
            </Typography>
          </Tooltip>
        ) : (
          <Typography variant="body2" noWrap>
            {dailyLimitText}
          </Typography>
        )}
        <Typography color="textSecondary" variant="body2">
          {`등록시간: ${dayjs(campaign.regiDate).format('YYYY/MM/DD HH:MM:SS')}`}
        </Typography>
      </div>
    </Paper>
  );
}
