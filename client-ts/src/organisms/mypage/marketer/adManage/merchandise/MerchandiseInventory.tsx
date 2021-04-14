import moment from 'moment';
import {
  IconButton, makeStyles, Tooltip, Typography
} from '@material-ui/core';
import React, { useState } from 'react';
import { Delete } from '@material-ui/icons';
import CustomDataGrid from '../../../../../atoms/Table/CustomDataGrid';
import { UsePaginatedGetRequestObject } from '../../../../../utils/hooks/usePaginatedGetRequest';
import { Merchandise } from '../interface';
import MerchandiseDeleteDialog from './MerchandiseDeleteDialog';
import { useDialog } from '../../../../../utils/hooks';
import Snackbar from '../../../../../atoms/Snackbar/Snackbar';
import renderMerchandiseUploadState from '../../../../../utils/render_funcs/renderMerchandiseUploadState';

const useStyles = makeStyles(() => ({
  datagrid: { height: 400, width: '100%' },
}));

export interface MerchandiseInventoryProps {
  merchandiseData: UsePaginatedGetRequestObject<Merchandise>;
  pageOffset: number;
  totalPageLength: number;
}

export default function MerchandiseInventory({
  merchandiseData,
  pageOffset,
  totalPageLength,
}: MerchandiseInventoryProps): JSX.Element {
  const classes = useStyles();

  const [selectedMerchandise, setSelectedMerchandise] = useState<Merchandise>();
  function handleSelect(m: Merchandise): void {
    setSelectedMerchandise(m);
  }

  const merchandiseDeleteDialog = useDialog();
  const successSnack = useDialog();
  return (
    <div className={classes.datagrid}>
      <CustomDataGrid
        pagination
        paginationMode="server"
        rowsPerPageOptions={[5]}
        onPageChange={(param): void => {
          // 페이지 수정 => 해당 페이지 데이터 로드
          // page 가 1부터 시작되므로 1 줄인다.
          merchandiseData.handlePage(param.page - 1);
        }}
        pageSize={pageOffset}
        rowCount={totalPageLength}
        disableSelectionOnClick
        loading={merchandiseData.loading}
        rows={merchandiseData.data || []}
        columns={[
          {
            field: 'id',
            headerName: '고유아이디',
            width: 120,
          },
          {
            field: 'name',
            headerName: '상품명',
            width: 150,
          },
          {
            field: 'price',
            headerName: '판매가',
            width: 150,
          },
          {
            field: 'stock',
            headerName: '재고',
            width: 150,
          },
          {
            field: 'uploadState',
            headerName: '상태',
            width: 150,
            renderCell: (data): React.ReactElement => (
              <div>
                <Typography variant="body2" noWrap>
                  {renderMerchandiseUploadState(data.row.uploadState)}
                </Typography>
                {data.row.uploadState === 0 && data.row.denialReason && (
                  <Tooltip title={`사유: ${data.row.denialReason}`}>
                    <Typography color="error" noWrap variant="body2">
                      {`사유: ${data.row.denialReason}`}
                    </Typography>
                  </Tooltip>
                )}
              </div>
            )
          },
          {
            field: 'createDate',
            width: 180,
            headerName: '등록 일자',
            renderCell: (data): React.ReactElement => (
              <Typography variant="body2" noWrap>
                {moment(data.row.createDate).format('YYYY/MM/DD HH:mm:ss')}
              </Typography>
            )
          },
          {
            field: '',
            width: 80,
            headerName: '삭제',
            disableColumnMenu: true,
            renderCell: (data): React.ReactElement => (
              <IconButton onClick={(): void => {
                handleSelect(data.row as Merchandise);
                merchandiseDeleteDialog.handleOpen();
              }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )
          }
        ]}
      />

      {merchandiseDeleteDialog.open && selectedMerchandise && (
      <MerchandiseDeleteDialog
        open={merchandiseDeleteDialog.open}
        selectedMerchandise={selectedMerchandise}
        handleClose={merchandiseDeleteDialog.handleClose}
        recallRequest={(): void => {
          merchandiseData.requestWithoutConcat();
          successSnack.handleOpen();
        }}
      />
      )}
      <Snackbar message="올바르게 삭제되었습니다." open={successSnack.open} onClose={successSnack.handleClose} />
    </div>
  );
}
