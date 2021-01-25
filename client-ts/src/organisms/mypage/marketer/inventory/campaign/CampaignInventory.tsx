import React from 'react';
import moment from 'moment';
import {
  Switch,
  Typography
} from '@material-ui/core';
import CustomDataGrid from '../../../../../atoms/Table/CustomDataGrid';
import { CampaignInterface } from '../../dashboard/interfaces';
import { UsePaginatedGetRequestObject } from '../../../../../utils/hooks/usePaginatedGetRequest';
import { useDialog, useGetRequest } from '../../../../../utils/hooks';
import VideoBanner from '../../../../../atoms/Banner/VideoBanner';
import isVideo from '../../../../../utils/isVideo';
import renderPriorityType from '../../../../../utils/renderPriorityType';
import renderOptionType from '../../../../../utils/renderOptionType';
import handleCampaignOnOff from '../../../../../utils/func/handleCampaignOnOff';
import Snackbar from '../../../../../atoms/Snackbar/Snackbar';

export interface CampaignInventoryProps {
  pageOffset: number;
  campaignData: UsePaginatedGetRequestObject<CampaignInterface>;
  handleItemSelect: (item: string) => void;
}
export default function CampaignInventory({
  pageOffset,
  campaignData,
  handleItemSelect
}: CampaignInventoryProps): JSX.Element {
  const pageLengthGet = useGetRequest('/marketer/campaign/length');

  // ******************************************
  // 캠페인 On/Off 변경 요청 성공 핸들러
  function onOnOffSuccess(): void {
    campaignData.request();
  }
  // 캠페인 On/Off 변경 요청 실패 핸들러
  const failSnack = useDialog();
  function onOnOffFail(): void {
    failSnack.handleOpen();
  }

  // *****************************************
  // 캠페인 클릭 핸들러
  function handleCampaignClick(cam: CampaignInterface): void {
    handleItemSelect(cam.campaignId);
    alert(`캠페인 클릭: ${cam.campaignId}`);
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <CustomDataGrid
        pagination
        paginationMode="server"
        pageSize={pageOffset}
        rowCount={pageLengthGet.data || 0}
        rowsPerPageOptions={[5]}
        onPageChange={(param): void => {
          // page 가 1부터 시작되므로 1 줄인다.
          campaignData.handlePage(param.page - 1);
        }}
        disableSelectionOnClick
        columns={[
          {
            field: 'onOff',
            headerName: 'On/Off',
            renderCell: (data): React.ReactElement => (
              <Switch
                size="small"
                id="onoff-switch"
                color="primary"
                checked={Boolean(data.row.onOff)}
                onChange={handleCampaignOnOff({
                  onoffState: !data.row.onOff,
                  campaignId: data.row.campaignId,
                  onSuccess: onOnOffSuccess,
                  onFail: onOnOffFail,
                })}
              />
            ),
          },
          {
            field: 'campaignName',
            headerName: '캠페인 명',
            width: 200,
            renderCell: (data): React.ReactElement => (
              <Typography
                noWrap
                variant="body2"
                onClick={(): void => handleCampaignClick(data.row as CampaignInterface)}
                style={{ cursor: 'pointer' }}
                color="primary"
              >
                {data.row.campaignName}
              </Typography>
            )
          },
          {
            headerName: '배너',
            field: 'bannerSrc',
            sortable: false,
            filterable: false,
            renderCell: (data): React.ReactElement => (
              <div>
                {isVideo(data.row.bannerSrc) ? (
                  <VideoBanner width="50" height="25" src={data.row.bannerSrc} />
                ) : (
                  <img width="50" height="25" src={data.row.bannerSrc} alt="" />
                )}
              </div>
            )
          },
          {
            field: 'optionType',
            headerName: '타입',
            width: 150,
            renderCell: (data): React.ReactElement => (
              <Typography noWrap variant="body2">{renderOptionType(data.row.optionType)}</Typography>
            )
          },
          {
            field: 'priorityType',
            headerName: '송출 우선순위',
            width: 150,
            renderCell: (data): React.ReactElement => (
              <Typography noWrap variant="body2">{renderPriorityType(data.row.priorityType)}</Typography>
            )
          },
          {
            field: 'dailyLimit',
            headerName: '일일 예산',
            width: 120,
            align: 'center',
            renderCell: (data): React.ReactElement => (
              <Typography noWrap variant="body2">
                {data.row.dailyLimit !== -1 ? data.row.dailyLimit.toLocaleString() : '없음'}
              </Typography>
            )
          },
          {
            field: 'regiDate',
            headerName: '생성일',
            width: 200,
            renderCell: (data): React.ReactElement => (
              <Typography noWrap variant="body2">{moment(data.row.regiDate).format('YYYY/MM/DD HH:mm:ss')}</Typography>
            ),
          },
        ]}
        rows={campaignData.data || []}
        loading={campaignData.loading}
      />

      {failSnack.open && (
        <Snackbar
          open={failSnack.open}
          onClose={failSnack.handleClose}
          message="캠페인 상태를 변경하는 데에 실패했습니다. 잠시 후 다시 시도해주세요."
          color="error"
        />
      )}
    </div>
  );
}
