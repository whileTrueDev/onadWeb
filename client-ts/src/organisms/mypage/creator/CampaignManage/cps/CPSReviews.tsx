import {
  Avatar,
  Button,
  makeStyles, Paper, Tooltip, Typography
} from '@material-ui/core';
import moment from 'moment';
import React, { useState } from 'react';
import SwipeableTextMobileStepper from '../../../../../atoms/Carousel/Carousel';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import CustomDataGrid from '../../../../../atoms/Table/CustomDataGrid';
import { getS3MerchandiseImagePath } from '../../../../../utils/aws/getS3Path';
import { useDialog, useToggle } from '../../../../../utils/hooks';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';

const useStyles = makeStyles((theme) => ({
  linkText: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  image: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
}));

export interface CPSReview {
  id: number;
  orderId: number;
  authorName: string;
  authorId: string;
  targetCreatorName: string;
  title: string;
  contents: string;
  creatorId: string;
  createDate: string;
  updateDate: string;
  merchandiseId: number;
  merchandiseName: string;
  orderPrice: number;
  optionId?: number;
  quantity: number;
  images: string;
  marketerId: string;
}

interface CPSReviewsProps {
  cpsReviewData: UseGetRequestObject<CPSReview[]>;
}

export default function CPSReviews({
  cpsReviewData,
}: CPSReviewsProps): React.ReactElement {
  const classes = useStyles();
  const detailDialog = useDialog();
  const [selectedReview, setSelectedReview] = useState<CPSReview>();
  function handleSelectedReview(review: CPSReview): void {
    setSelectedReview(review);
  }
  function handleSelectedReviewReset(): void {
    setSelectedReview(undefined);
  }

  const getAuthorName = (review: CPSReview): string => `${review.authorName}(${review.authorId})`;

  const imgaeToggle = useToggle(false);

  return (
    <Paper style={{ height: 400, marginTop: 8, padding: 32 }}>
      <CustomDataGrid
        loading={cpsReviewData.loading}
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
            }
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
            )
          },
          {
            width: 130,
            headerName: '구매액',
            field: 'orderPrice',
            renderCell: (data): React.ReactElement => (
              <Typography variant="body2" noWrap>
                {data.row.orderPrice ? data.row.orderPrice.toLocaleString() : 0}
              </Typography>
            )
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
            }
          },
          {
            width: 130,
            headerName: '일시',
            field: 'createDate',
            renderCell: (data): React.ReactElement => (
              <Typography variant="body2">
                {moment(data.row.createDate).format('YY/MM/DD HH:mm:ss')}
              </Typography>
            )
          },
        ]}
      />

      {selectedReview && (
      <CustomDialog
        maxWidth="sm"
        fullWidth
        title={`응원메시지 - ${selectedReview.title}`}
        open={detailDialog.open}
        onClose={() => {
          detailDialog.handleClose();
          handleSelectedReviewReset();
        }}
      >
        <article>
          <Typography>
            {`${selectedReview.merchandiseName}, ${selectedReview.orderPrice.toLocaleString()}원 (${selectedReview.quantity}개)`}
          </Typography>
          <Typography variant="h5" style={{ fontWeight: 'bold' }}>{selectedReview.title}</Typography>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
            <Avatar src="" style={{ marginRight: 8 }} />
            <div>
              <Typography variant="body2">{getAuthorName(selectedReview)}</Typography>
              <Typography variant="body2" color="textSecondary">
                {moment(selectedReview.createDate).format('YY/MM/DD HH:mm:ss')}
              </Typography>
            </div>
          </div>
        </article>

        <div className={classes.image}>
          {selectedReview.images && (
            <>
              <Button
                size="small"
                color="primary"
                variant="outlined"
                onClick={imgaeToggle.handleToggle}
              >
                {`상품사진 ${imgaeToggle.toggle ? '닫기' : '열기'}`}
              </Button>
              {imgaeToggle.toggle && (
              <SwipeableTextMobileStepper
                images={selectedReview.images.split(',')
                  .map((image) => getS3MerchandiseImagePath(
                    selectedReview.marketerId, selectedReview.merchandiseId, image
                  ))}
              />
              )}
            </>
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          <Typography>{selectedReview.contents}</Typography>
        </div>
      </CustomDialog>
      )}
    </Paper>
  );
}
