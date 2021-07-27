/* eslint-disable react/display-name */
import { IconButton, Tooltip, Typography } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useState } from 'react';
import OnadBanner from '../../../../../atoms/Banner/OnadBanner';
import CustomDataGrid from '../../../../../atoms/Table/CustomDataGrid';
import { useAnchorEl, useDialog } from '../../../../../utils/hooks';
import { useMarketerBannerLength } from '../../../../../utils/hooks/query/useMarketerBannerLength';
import {
  MarketerBanner,
  useMarketerBannerList,
} from '../../../../../utils/hooks/query/useMarketerBannerList';
import renderBannerConfirmState, {
  CONFIRM_STATE_REJECTED,
} from '../../../../../utils/render_funcs/renderBannerConfirmState';
import BannerInfoPopover from '../campaign/BannerInfoPopover';
import DeleteDialog from './DeleteDialog';

export default function BannerInventory(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  // 배너 데이터 조회
  const bannerPageLength = useMarketerBannerLength();
  const FETCH_PAGE_OFFSET = 5;
  const [page, setPage] = useState(0);
  const handlePage = (targetPage: number) => setPage(targetPage);
  const banners = useMarketerBannerList({ page, offset: FETCH_PAGE_OFFSET });
  // 배너 삭제 다이얼로그
  const deleteDialog = useDialog();
  const anchor = useAnchorEl(); // 배너 자세하 보기 앵커
  // 배너 선택
  const [selectedBanner, setBanner] = React.useState<MarketerBanner | null>(null);
  function handleBannerSelect(banner: MarketerBanner): void {
    setBanner(banner);
  }

  return (
    <div>
      <div style={{ height: 400, width: '100%' }}>
        <CustomDataGrid
          pagination
          paginationMode="server"
          rowsPerPageOptions={[5]}
          onPageChange={(param): void => {
            // 페이지 수정 => 해당 페이지 데이터 로드
            // page 가 1부터 시작되므로 1 줄인다.
            handlePage(param.page);
          }}
          pageSize={FETCH_PAGE_OFFSET}
          rowCount={bannerPageLength.data}
          disableSelectionOnClick
          loading={banners.isLoading}
          rows={banners.data || []}
          columns={[
            {
              headerName: '배너',
              field: 'bannerId',
              width: 150,
              renderCell: (data): React.ReactElement => (
                <Tooltip title={data.row.bannerId}>
                  <Typography noWrap variant="body2">
                    {data.row.bannerId}
                  </Typography>
                </Tooltip>
              ),
            },
            {
              headerName: '이미지',
              field: 'bannerSrc',
              width: 150,
              renderCell: (rowData): React.ReactElement => (
                <OnadBanner
                  src={rowData.row.bannerSrc}
                  width="50"
                  height="30"
                  style={{ cursor: 'zoom-in' }}
                  onClick={(e): void => {
                    handleBannerSelect(rowData.row as MarketerBanner);
                    anchor.handleAnchorOpen(e);
                  }}
                />
              ),
            },
            {
              headerName: '심의 결과',
              field: 'confirmState',
              width: 130,
              renderCell: (data): React.ReactElement => (
                <Typography
                  variant="body2"
                  color={data.row.confirmState === CONFIRM_STATE_REJECTED ? 'error' : 'textPrimary'}
                >
                  {renderBannerConfirmState(data.row.confirmState)}
                  <br />
                  {data.row.confirmState === CONFIRM_STATE_REJECTED && (
                    // 거절됨의 경우 사유 렌더링
                    <Typography noWrap component="span" variant="caption" color="error">
                      {data.row.bannerDenialReason}
                    </Typography>
                  )}
                </Typography>
              ),
            },
            {
              headerName: '배너 등록 일자',
              field: 'regiDate',
              width: 150,
              renderCell: (data): React.ReactElement => (
                <Typography variant="body2">
                  {dayjs(data.row.regiDate).format('YYYY/MM/DD HH:mm:ss')}
                </Typography>
              ),
            },
            {
              field: '',
              headerName: '삭제',
              width: 70,
              sortable: false,
              filterable: false,
              disableColumnMenu: true,
              renderCell: (data): React.ReactElement => (
                <IconButton
                  onClick={(): void => {
                    handleBannerSelect(data.row as MarketerBanner);
                    deleteDialog.handleOpen();
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              ),
            },
          ]}
        />
      </div>

      {/* banner  delete dialog */}
      {deleteDialog.open && selectedBanner && (
        <DeleteDialog
          open={deleteDialog.open}
          selectedBanner={selectedBanner}
          handleClose={deleteDialog.handleClose}
        />
      )}

      {/* 배너 자세히 보기 popper */}
      {selectedBanner && anchor.open && anchor.anchorEl && (
        <BannerInfoPopover
          selectedBanner={selectedBanner}
          open={anchor.open}
          anchorEl={anchor.anchorEl}
          onClose={anchor.handleAnchorClose}
        />
      )}
    </div>
  );
}
