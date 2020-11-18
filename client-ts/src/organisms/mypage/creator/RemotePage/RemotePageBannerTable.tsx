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
  loading: boolean; campaignId: string; marketerName: string; date: string; bannerSrc: string; state: number;
}

const RemotePageBannerTable = (props: any) => {
  // const { remoteCampaignTableGet } = props;
  const remoteCampaignTableGet = useGetRequest<null, BannerStatus[]>('/creator/banner/remote-page');
  const onOffUpdate = usePatchRequest('/creator/banner/remote-page', () => {
    remoteCampaignTableGet.doGetRequest();
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
  console.log(remoteCampaignTableGet);
  return (
    <Table>
      <TableBody>
        {remoteCampaignTableGet.loading && (<Skeleton height={400} variant="rect" animation="wave" />)}
        {!remoteCampaignTableGet.loading && remoteCampaignTableGet.data?.map((value: any) => (
          <TableRow key={value.index}>
            <TableCell style={{
              flexDirection: 'column',
              textAlign: 'center'
              // justifyItems: 'center'
            }}
            >
              <Typography variant="body1">
                {value.marketerName}
              </Typography>
              <FormControlLabel
                label=""
                control={(
                  <Switch
                    checked={value.state}
                    color="secondary"
                    onChange={(): void => {
                      handleSwitch(value.campaignId, value.state);
                    }}
                  />

            )}
              />
              <Typography variant="body1">
                {value.date}
              </Typography>
            </TableCell>
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
              배너설명
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RemotePageBannerTable;
