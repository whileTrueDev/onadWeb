import { Avatar, Button, makeStyles, Typography } from '@material-ui/core';
import dayjs from 'dayjs';
import * as React from 'react';
import ImageCarousel from '../../../../../atoms/carousel/carousel';
import OrderStatusChip from '../../../../../atoms/chip/orderStatusChip';
import CustomDialog from '../../../../../atoms/dialog/dialog';
import { getReadableS3MerchandiseImagePath } from '../../../../../utils/aws/getS3Path';
import { useToggle } from '../../../../../utils/hooks';
import { OrderStatus } from '../../../../../utils/render_funcs/renderOrderStatus';

const useStyles = makeStyles(theme => ({
  linkText: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  image: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  nameSection: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  },
  contents: {
    margin: theme.spacing(2, 0),
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
}));

export interface CPSReview {
  id: number;
  orderId: number;
  authorName: string;
  authorId: string;
  targetCreatorName: string;
  status: OrderStatus;
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

interface CPSReviewDialogProps {
  open: boolean;
  onClose: () => void;
  review: CPSReview;
}

export default function CPSReviewDialog({
  open,
  onClose,
  review,
}: CPSReviewDialogProps): React.ReactElement {
  const classes = useStyles();

  const imgaeToggle = useToggle(false);

  return (
    <CustomDialog
      maxWidth="sm"
      fullWidth
      title={`응원메시지 - ${review.title}`}
      open={open}
      onClose={onClose}
    >
      <article>
        <div className={classes.title}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography>주문상태:</Typography>
            <OrderStatusChip status={review.status} />
          </div>
          <Typography>
            {`${review.merchandiseName}(${
              review.quantity
            }개) 구매금액: ${review.orderPrice.toLocaleString()}원`}
          </Typography>
        </div>
        <Typography variant="h5" style={{ fontWeight: 'bold' }}>
          {review.title}
        </Typography>
        <div className={classes.nameSection}>
          <Avatar src="" className={classes.avatar} />
          <div>
            <Typography variant="body2">{`${review.authorName}(${review.authorId})`}</Typography>
            <Typography variant="body2" color="textSecondary">
              {dayjs(review.createDate).format('YY/MM/DD HH:mm:ss')}
            </Typography>
          </div>
        </div>
      </article>

      <div className={classes.image}>
        {review.images && (
          <>
            <Button
              size="small"
              color="primary"
              variant="outlined"
              onClick={imgaeToggle.handleToggle}
              className={classes.title}
            >
              {`상품사진 ${imgaeToggle.toggle ? '닫기' : '열기'}`}
            </Button>
            {imgaeToggle.toggle && (
              <ImageCarousel
                images={review.images
                  .split(',')
                  .map(image =>
                    getReadableS3MerchandiseImagePath(
                      review.marketerId,
                      review.merchandiseId,
                      image,
                    ),
                  )}
              />
            )}
          </>
        )}
      </div>

      <div className={classes.contents}>
        <Typography>{review.contents}</Typography>
      </div>
    </CustomDialog>
  );
}
