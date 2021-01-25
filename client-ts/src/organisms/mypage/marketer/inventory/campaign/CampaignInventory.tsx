import React, { useState } from 'react';
import moment from 'moment';
import {
  ButtonBase,
  Switch,
  Typography
} from '@material-ui/core';
import CustomDataGrid from '../../../../../atoms/Table/CustomDataGrid';
import { CampaignInterface } from '../../dashboard/interfaces';
import { UsePaginatedGetRequestObject } from '../../../../../utils/hooks/usePaginatedGetRequest';
import { useAnchorEl, useDialog, useGetRequest } from '../../../../../utils/hooks';
import renderPriorityType from '../../../../../utils/renderPriorityType';
import renderOptionType from '../../../../../utils/renderOptionType';
import handleCampaignOnOff from '../../../../../utils/func/handleCampaignOnOff';
import Snackbar from '../../../../../atoms/Snackbar/Snackbar';
import BannerInfoPopover from './BannerInfoPopover';
import isVideo from '../../../../../utils/isVideo';
import VideoBanner from '../../../../../atoms/Banner/VideoBanner';

export interface CampaignInventoryProps {
  pageOffset: number;
  campaignData: UsePaginatedGetRequestObject<CampaignInterface>;
}
export default function CampaignInventory({
  pageOffset,
  campaignData,
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
  const anchor = useAnchorEl();
  const [selected, setSelected] = useState<CampaignInterface>();
  function handleBannerClick(e: React.MouseEvent<HTMLSpanElement>, cam: CampaignInterface): void {
    setSelected(cam);
    anchor.handleAnchorOpen(e);
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
          // 페이지 수정 => 해당 페이지 데이터 로드
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
              <Typography noWrap variant="body2">
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
              // <Typography
              //   onClick={(e): void => handleBannerClick(e, data.row as CampaignInterface)}
              //   style={{ cursor: 'pointer' }}
              //   color="primary"
              //   variant="body2"
              //   noWrap
              // >
              //   {data.row.bannerId}
              // </Typography>
              <>
                { isVideo(data.row.bannerSrc) ? (
                  <VideoBanner
                    onClick={(e): void => handleBannerClick(e, data.row as CampaignInterface)}
                    style={{ cursor: 'pointer' }}
                    src={data.row.bannerSrc}
                    width="50"
                    height="30"
                  />
                ) : (
                  <ButtonBase
                    onClick={(e): void => handleBannerClick(e, data.row as CampaignInterface)}
                  >
                    <img
                      src={data.row.bannerSrc}
                      alt={data.row.bannerId}
                      width="50"
                      height="30"
                    />
                  </ButtonBase>
                )}
              </>
            )
          },
          {
            headerName: 'URL',
            field: 'linkId',
            sortable: false,
            filterable: false,
            width: 120,
            renderCell: (data): React.ReactElement => (
              <Typography
                // onClick={(e): void => handleItemClick(e, data.row as CampaignInterface)}
                style={{ cursor: 'pointer' }}
                color="primary"
                variant="body2"
                noWrap
              >
                {data.row.linkId}
              </Typography>
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
            headerName: '생성 날짜',
            width: 200,
            renderCell: (data): React.ReactElement => (
              <Typography noWrap variant="body2">{moment(data.row.regiDate).format('YYYY/MM/DD HH:mm:ss')}</Typography>
            ),
          },
        ]}
        rows={campaignData.data || []}
        loading={campaignData.loading}
      />

      {/* 배너 자세히 보기 popper */}
      {selected && anchor.open && anchor.anchorEl && (
        <BannerInfoPopover
          selectedCampaign={selected}
          open={anchor.open}
          anchorEl={anchor.anchorEl}
          onClose={anchor.handleAnchorClose}
        />
      )}

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
