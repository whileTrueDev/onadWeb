import React from 'react';
import moment from 'moment';
import {
  Typography, Tooltip, IconButton,
} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import { BannerDataInterface } from '../interface';
import { useAnchorEl, useDialog } from '../../../../../utils/hooks';
import DeleteDialog from './DeleteDialog';
import CustomDataGrid from '../../../../../atoms/Table/CustomDataGrid';
import { UsePaginatedGetRequestObject } from '../../../../../utils/hooks/usePaginatedGetRequest';
import BannerInfoPopover from '../campaign/BannerInfoPopover';
import OnadBanner from '../../../../../atoms/Banner/OnadBanner';

interface BannerInventoryProps {
  pageOffset: number;
  totalPageLength: number;
  bannerData: UsePaginatedGetRequestObject<BannerDataInterface>;
}

export default function BannerInventory(props: BannerInventoryProps): JSX.Element {
  const {
    totalPageLength, pageOffset, bannerData,
  } = props;


  // 배너 삭제 다이얼로그
  const deleteDialog = useDialog();
  const anchor = useAnchorEl(); // 배너 자세하 보기 앵커
  // 배너 선택
  const [selectedBanner, setBanner] = React.useState<BannerDataInterface | null>(null);
  function handleBannerSelect(banner: BannerDataInterface): void{
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
            bannerData.handlePage(param.page - 1);
          }}
          pageSize={pageOffset}
          rowCount={totalPageLength}
          disableSelectionOnClick
          rows={bannerData.data || []}
          columns={[
            {
              headerName: '배너',
              field: 'bannerId',
              renderCell: (data): React.ReactElement => (
                <Typography variant="body2">
                  {data.row.bannerId}
                </Typography>
              )
            },
            {
              headerName: '이미지',
              field: 'bannerSrc',
              width: 130,
              renderCell: (rowData): React.ReactElement => (
                <OnadBanner
                  src={rowData.row.bannerSrc}
                  width="50"
                  height="30"
                  style={{ cursor: 'zoom-in' }}
                  onClick={(e): void => {
                    handleBannerSelect(rowData.row as BannerDataInterface);
                    anchor.handleAnchorOpen(e);
                  }}
                />
              )
            },
            {
              headerName: '심의 결과',
              field: 'confirmState',
              width: 110,
              renderCell: (rowData): React.ReactElement => {
                switch (rowData.row.confirmState) {
                  case 0: return <Typography variant="body2">진행중</Typography>;
                  case 1: return <Typography variant="body2">승인됨</Typography>;
                  case 2: return (
                    <Tooltip
                      title={<Typography variant="caption">{`사유: ${rowData.row.bannerDenialReason}`}</Typography>}
                    >
                      <Typography variant="body2" color="error">거절됨</Typography>
                    </Tooltip>
                  );
                  default: throw new Error('you need confirmState for table');
                }
              },

            },
            {
              headerName: '배너 등록 일자',
              field: 'regiDate',
              width: 150,
              renderCell: (data): React.ReactElement => (
                <Typography variant="body2">{moment(data.row.regiDate).format('YYYY/MM/DD HH:mm:ss')}</Typography>
              )
            },
            {
              field: '',
              headerName: '삭제',
              width: 70,
              sortable: false,
              filterable: false,
              disableColumnMenu: true,
              disableClickEventBubbling: true,
              renderCell: (data): React.ReactElement => (
                <IconButton onClick={(e): void => {
                  handleBannerSelect(data.row as BannerDataInterface);
                  deleteDialog.handleOpen();
                }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              )
            }
          ]}
        />
      </div>


      {/* banner  delete dialog */}
      {deleteDialog.open && selectedBanner && (
      <DeleteDialog
        open={deleteDialog.open}
        selectedBanner={selectedBanner}
        handleClose={deleteDialog.handleClose}
        recallRequest={bannerData.request}
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
