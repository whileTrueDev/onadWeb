import React from 'react';
import shortid from 'shortid';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  Table, TableHead, TableRow, TableBody, TableCell, Switch,
  Typography, FormControlLabel, Chip
} from '@material-ui/core';
import isVideo from '../../../../utils/isVideo';
import VideoBanner from '../../../../atoms/Banner/VideoBanner';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';
import useDialog from '../../../../utils/hooks/useDialog';
import usePatchRequest from '../../../../utils/hooks/usePatchRequest';
import useGetRequest from '../../../../utils/hooks/useGetRequest';

export interface BannerStatus {
  loading: boolean; campaignId: string; index: number;
  marketerName: string; priorityType: number;
  targetList: string[]; date: string; bannerSrc: string;
  state: number; campaignDescription: string;
  creatorName: string;
}

interface RemotePageBannerTable {
  pageUrl: string;
}

interface Params {
  remoteControllerUrl: string;
}
const RemotePageBannerTable = (props: RemotePageBannerTable): JSX.Element => {
  const {
    pageUrl
  } = props;

  const snack = useDialog();
  const failSnack = useDialog();
  const remoteCampaignTableGet = useGetRequest<Params, BannerStatus[]>('/creator/banner/remote-page', { remoteControllerUrl: pageUrl });

  const onOffUpdate = usePatchRequest('/creator/banner/remote-page', () => {
    remoteCampaignTableGet.doGetRequest();
  });

  const handleSwitch = (campaignId: string, state: number, url: string): void => {
    onOffUpdate.doPatchRequest({ campaignId, state, url });
  };

  const page = 1; // 테이블 페이지
  const rowsPerPage = 8; // 테이블 페이지당 행

  const emptyRows = !remoteCampaignTableGet.loading && remoteCampaignTableGet.data && (rowsPerPage - Math.min(
    rowsPerPage, remoteCampaignTableGet.data.length - page * rowsPerPage,
  ));

  React.useEffect(() => {
    if (onOffUpdate.error) {
      failSnack.handleOpen();
    }
  }, [onOffUpdate.error, failSnack]);

  const categorySwitch = (category: number, targetList: string[], creatorName: string): JSX.Element => {
    switch (category) {
      case 0: return (
        <TableCell>
          <Chip
            size="small"
            label="크리에이터 우선형"
            style={{ marginBottom: '5px' }}
          />
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
          <Chip
            color="primary"
            size="small"
            label="카테고리 우선형"
            style={{ marginBottom: '5px' }}
          />
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
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{
              flexDirection: 'column',
              textAlign: 'center',
              width: '170px',
              padding: '5px'
            }}
            >
              시작일 / 광고주
            </TableCell>
            <TableCell style={{
              flexDirection: 'column',
              textAlign: 'center',
              width: '170px',
              padding: '5px'
            }}
            >
              카테고리
            </TableCell>
            <TableCell style={{
              flexDirection: 'column',
              textAlign: 'center',
              width: '170px',
              padding: '5px'
            }}
            >
              배너 이미지
            </TableCell>
            <TableCell style={{
              flexDirection: 'column',
              textAlign: 'center',
              width: '170px',
              padding: '5px'
            }}
            >
              배너 설명
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {remoteCampaignTableGet?.data?.map((value: BannerStatus) => (
            <TableRow key={value.index}>
              <TableCell style={{
                flexDirection: 'column',
                textAlign: 'center',
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
                        handleSwitch(value.campaignId, value.state, pageUrl);
                        snack.handleOpen();
                      }}
                      disabled={Boolean(remoteCampaignTableGet.loading)}
                    />

            )}
                />
                <Typography variant="body1">
                  {value.date.split('T')[0]}
                </Typography>
              </TableCell>
              {categorySwitch(value.priorityType, value.targetList, value.creatorName)}
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
          {emptyRows && emptyRows > 0 && (
          <TableRow style={{ height: 48 * emptyRows }} key={shortid.generate()}>
            <TableCell colSpan={4} />
          </TableRow>
          )}
        </TableBody>
        {remoteCampaignTableGet.loading && (
        <TableCell
          align="center"
          colSpan={4}
        >
          <CircularProgress />
        </TableCell>
        )}
      </Table>

      <Snackbar
        color="success"
        open={snack.open}
        message="정상적으로 변경되었습니다."
        onClose={snack.handleClose}
      />

      <Snackbar
        color="error"
        open={failSnack.open}
        message="변경중 오류가 발생했습니다."
        onClose={failSnack.handleClose}
      />
    </div>
  );
};

export default RemotePageBannerTable;
