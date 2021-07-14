/* eslint-disable react/display-name */
import { makeStyles, Paper, Tooltip, Typography } from '@material-ui/core';
import dayjs from 'dayjs';
import * as React from 'react';
import { useState } from 'react';
import OrderStatusChip from '../../../../../atoms/Chip/OrderStatusChip';
import CustomDataGrid from '../../../../../atoms/Table/CustomDataGrid';
import { useDialog } from '../../../../../utils/hooks';
import { useCreatorCpsReviews } from '../../../../../utils/hooks/query/useCreatorCpsReviews';
import CPSReviewDialog, { CPSReview } from './CPSReviewDialog';

const useStyles = makeStyles(() => ({
  linkText: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}));

export default function CPSReviews(): React.ReactElement {
  const classes = useStyles();

  const cpsReviewData = useCreatorCpsReviews();

  const detailDialog = useDialog();
  const [selectedReview, setSelectedReview] = useState<CPSReview>();
  function handleSelectedReview(review: CPSReview): void {
    setSelectedReview(review);
  }
  function handleSelectedReviewReset(): void {
    setSelectedReview(undefined);
  }

  const getAuthorName = (review: CPSReview): string => `${review.authorName}(${review.authorId})`;

  return (
    <Paper style={{ height: 420, marginTop: 8, padding: 32 }}>
      <Typography style={{ fontWeight: 'bold' }}>응원 메시지</Typography>
      <CustomDataGrid
        loading={cpsReviewData.isLoading}
        rows={cpsReviewData.data || []}
        columns={[
          {
            width: 150,
            headerName: '구매자',
            field: 'authorName',
            renderCell: (data): React.ReactElement => {
              const name = getAuthorName(data.row as CPSReview);
              return (
                <Tooltip title={name}>
                  <Typography variant="body2" noWrap>
                    {name}
                  </Typography>
                </Tooltip>
              );
            },
          },
          {
            width: 130,
            headerName: '상품명',
            field: 'merchandiseName',
            renderCell: (data): React.ReactElement => (
              <Tooltip title={data.row.merchandiseName}>
                <Typography variant="body2" noWrap>
                  {data.row.merchandiseName}
                </Typography>
              </Tooltip>
            ),
          },
          {
            width: 130,
            headerName: '구매액',
            field: 'orderPrice',
            renderCell: (data): React.ReactElement => (
              <Typography variant="body2" noWrap>
                {data.row.orderPrice ? data.row.orderPrice.toLocaleString() : 0}
              </Typography>
            ),
          },
          {
            width: 250,
            headerName: '제목',
            field: 'title',
            renderCell: (data): React.ReactElement => {
              const { title } = data.row;
              return (
                <Tooltip title={title}>
                  <Typography
                    variant="body2"
                    noWrap
                    color="primary"
                    onClick={(): void => {
                      handleSelectedReview(data.row as CPSReview);
                      detailDialog.handleOpen();
                    }}
                    className={classes.linkText}
                  >
                    {title}
                  </Typography>
                </Tooltip>
              );
            },
          },
          {
            width: 120,
            headerName: '주문상태',
            field: 'status',
            renderCell: (data): React.ReactElement => <OrderStatusChip status={data.row.status} />,
          },
          {
            width: 130,
            headerName: '일시',
            field: 'createDate',
            renderCell: (data): React.ReactElement => (
              <Typography variant="body2">
                {dayjs(data.row.createDate).format('YY/MM/DD HH:mm:ss')}
              </Typography>
            ),
          },
        ]}
      />

      {selectedReview && (
        <CPSReviewDialog
          open={detailDialog.open}
          onClose={() => {
            detailDialog.handleClose();
            handleSelectedReviewReset();
          }}
          review={selectedReview}
        />
      )}
    </Paper>
  );
}
