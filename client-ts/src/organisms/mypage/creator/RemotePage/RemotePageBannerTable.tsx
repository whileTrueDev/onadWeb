import React from 'react';
import {
  Table, TableHead, TableRow, TableBody, TableCell, Switch,
  Grid, Typography, Divider, Hidden, IconButton, Tooltip, FormControlLabel
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import classnames from 'classnames';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import usePatchRequest from '../../../../utils/hooks/usePatchRequest';
import isVideo from '../../../../utils/isVideo';
import VideoBanner from '../../../../atoms/Banner/VideoBanner';

export interface BannerStatus {
  loading: boolean; campaignId: string;
  marketerName: string; priorityType: number;
  targetList: any; date: string; bannerSrc: string;
  state: number; campaignDescription: string;
}

const RemotePageBannerTable = (props: any) => {
  const { creatorName, tableData, remoteCampaignOnOff } = props;
  const onOffUpdate = usePatchRequest('/creator/banner/remote-page', () => {
    remoteCampaignOnOff();
  });
  const handleSwitch = (campaignId: string, state: number): void => {
    onOffUpdate.doPatchRequest({ campaignId, state });
    console.log('epdlxj', campaignId, state);
  };

  // interface CampaignTableProps {
  //   tableData: BannerStatus[];
  //   pagination: boolean;
  //   handleDialogOpen: () => void;
  //   handleCampaignSelect: (campaign: BannerStatus) => void;
  // }
  const categorySwitch = (category: number, targetList: any, creatorName: string) => {
    switch (category) {
      case 0: return (
        <TableCell>
          <Typography variant="body2">
            <span style={{ fontWeight: 'bold' }}>
              {creatorName}
            </span>
            님과 매칭된 광고입니다.
          </Typography>
        </TableCell>
      );
      case 1: return (
        <TableCell>
          <Typography variant="body2">
            <span style={{ fontWeight: 'bold' }}>
              {targetList.join(', ')}
            </span>
            와 매칭 되는 광고입니다.
          </Typography>
        </TableCell>
      );
      case 2: return (
        <TableCell>
          <Typography variant="body2">
            자동으로 매칭되는 광고입니다.
          </Typography>
        </TableCell>
      );
      default: return (
        <TableCell>
          <Typography variant="body2">
            자동으로 매칭되는 광고입니다.
          </Typography>
        </TableCell>
      );
    }
  };
  return (
    <Table>
      <TableBody>
        {tableData.data?.map((value: any) => (
          <TableRow key={value.index}>

            <TableCell style={{
              flexDirection: 'column',
              textAlign: 'center',
              width: '170px',
              padding: '5px'
            }}
            >
              <Typography variant="body1">
                {value.marketerName}
              </Typography>
              <FormControlLabel
                label=""
                control={(
                  <Switch
                    checked={Boolean(value.state)}
                    color="secondary"
                    onChange={(): void => {
                      handleSwitch(value.campaignId, value.state);
                    }}
                  />

            )}
              />
              <Typography variant="body1">
                {value.date.split('T')[0]}
              </Typography>
            </TableCell>
            {categorySwitch(value.priorityType, value.targetList, creatorName)}
            <TableCell>
              <div>
                { isVideo(value.bannerSrc) ? (
                  <VideoBanner src={value.bannerSrc} style={{ maxHeight: '100px', width: '150' }} />
                ) : (
                  <img src={value.bannerSrc} alt="banner" style={{ maxHeight: '100px', width: '150' }} />
                )}
              </div>
            </TableCell>
            <TableCell>
              {value.campaignDescription}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RemotePageBannerTable;
