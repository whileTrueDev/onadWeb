import React from 'react';
import shortid from 'shortid';

import {
  Table, TableHead, TableRow, TableBody, TableCell, Switch,
  Typography, FormControlLabel
} from '@material-ui/core';
import isVideo from '../../../../utils/isVideo';
import VideoBanner from '../../../../atoms/Banner/VideoBanner';
import Snackbar from '../../../../atoms/Snackbar/Snackbar';
import useDialog from '../../../../utils/hooks/useDialog';
import usePatchRequest from '../../../../utils/hooks/usePatchRequest';

export interface BannerStatus {
  loading: boolean; campaignId: string; index: number;
  marketerName: string; priorityType: number;
  targetList: string[]; date: string; bannerSrc: string;
  state: number; campaignDescription: string;
  creatorName: string;
}

interface PatchParams {
  campaignId: string;
  state: number;
  url: string;
}
interface RemotePageBannerTable {
  tableData: BannerStatus[];
  doGetRequestOnOff: () => void;
  pageUrl: string;
}
const RemotePageBannerTable = (props: RemotePageBannerTable): JSX.Element => {
  const {
    tableData, doGetRequestOnOff, pageUrl
  } = props;

  const snack = useDialog();
  const failSnack = useDialog();

  const onOffUpdate = usePatchRequest('/creator/banner/remote-page', () => {
    doGetRequestOnOff();
  });

  const handleSwitch = (campaignId: string, state: number, url: string): void => {
    onOffUpdate.doPatchRequest({ campaignId, state, url });
  };
  const page = 1; // 테이블 페이지
  const rowsPerPage = 8; // 테이블 페이지당 행
  const emptyRows = rowsPerPage - Math.min(
    rowsPerPage, tableData.length - page * rowsPerPage,
  );

  React.useEffect(() => {
    if (onOffUpdate.error) {
      failSnack.handleOpen();
    }
  }, [onOffUpdate.error, failSnack]);

  const categorySwitch = (category: number, targetList: string[], creatorName: string): JSX.Element => {
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
          {tableData?.map((value: BannerStatus) => (
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
          {emptyRows > 0 && (
          <TableRow style={{ height: 48 * emptyRows }} key={shortid.generate()}>
            <TableCell colSpan={4} />
          </TableRow>
          )}
        </TableBody>
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
