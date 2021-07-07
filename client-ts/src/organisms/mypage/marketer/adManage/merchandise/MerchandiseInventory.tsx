/* eslint-disable react/display-name */
import { IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import dayjs from 'dayjs';
import * as React from 'react';
import { useState } from 'react';
import CustomDataGrid from '../../../../../atoms/Table/CustomDataGrid';
import getDiscountPrice from '../../../../../utils/getDiscountPrice';
import { useDialog } from '../../../../../utils/hooks';
import { useMarketerMerchandisesLength } from '../../../../../utils/hooks/query/useMarketerMerchandisesLength';
import {
  Merchandise,
  useMarketerMerchandisesList,
} from '../../../../../utils/hooks/query/useMarketerMerchandisesList';
import renderMerchandiseUploadState from '../../../../../utils/render_funcs/renderMerchandiseUploadState';
import MerchandiseDeleteDialog from './MerchandiseDeleteDialog';

const useStyles = makeStyles(() => ({
  datagrid: { height: 400, width: '100%' },
}));

const FETCH_PAGE_OFFSET = 5;
export default function MerchandiseInventory(): JSX.Element {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const handlePage = (targetPage: number) => setPage(targetPage);
  // 상품 데이터
  const merchandiseData = useMarketerMerchandisesList({ page, offset: FETCH_PAGE_OFFSET });
  const merchandisesLength = useMarketerMerchandisesLength();

  const [selectedMerchandise, setSelectedMerchandise] = useState<Merchandise>();
  function handleSelect(m: Merchandise): void {
    setSelectedMerchandise(m);
  }

  const merchandiseDeleteDialog = useDialog();

  return (
    <div className={classes.datagrid}>
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
        rowCount={merchandisesLength.data}
        disableSelectionOnClick
        loading={merchandiseData.isLoading}
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
            field: 'regularPrice',
            headerName: '정가',
            width: 120,
          },
          {
            field: 'price',
            headerName: '판매가',
            width: 170,
            renderCell: (data): React.ReactElement => {
              const discountRate = getDiscountPrice(data.row.regularPrice, data.row.price);
              return (
                <Typography variant="body2">
                  {data.row.price}{' '}
                  {discountRate > 0 && (
                    <Typography variant="caption" component="span">
                      {`(할인율 ${discountRate}%)`}
                    </Typography>
                  )}
                </Typography>
              );
            },
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
            ),
          },
          {
            field: 'createDate',
            width: 180,
            headerName: '등록 일자',
            renderCell: (data): React.ReactElement => (
              <Typography variant="body2" noWrap>
                {dayjs(data.row.createDate).format('YYYY/MM/DD HH:mm:ss')}
              </Typography>
            ),
          },
          {
            field: '',
            width: 80,
            headerName: '삭제',
            disableColumnMenu: true,
            renderCell: (data): React.ReactElement => (
              <IconButton
                onClick={(): void => {
                  handleSelect(data.row as Merchandise);
                  merchandiseDeleteDialog.handleOpen();
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            ),
          },
        ]}
      />

      {merchandiseDeleteDialog.open && selectedMerchandise && (
        <MerchandiseDeleteDialog
          open={merchandiseDeleteDialog.open}
          selectedMerchandise={selectedMerchandise}
          handleClose={merchandiseDeleteDialog.handleClose}
        />
      )}
    </div>
  );
}
