import {
  Typography, Avatar, makeStyles, Button
} from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import ImageCarousel from '../../../../../atoms/Carousel/Carousel';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import { getReadableS3MerchandiseImagePath } from '../../../../../utils/aws/getS3Path';
import { useToggle } from '../../../../../utils/hooks';


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
        <Typography>
          {`${review.merchandiseName}(${review.quantity}개) 구매금액: ${review.orderPrice.toLocaleString()}원`}
        </Typography>
        <Typography variant="h5" style={{ fontWeight: 'bold' }}>{review.title}</Typography>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
          <Avatar src="" style={{ marginRight: 8 }} />
          <div>
            <Typography variant="body2">{`${review.authorName}(${review.authorId})`}</Typography>
            <Typography variant="body2" color="textSecondary">
              {moment(review.createDate).format('YY/MM/DD HH:mm:ss')}
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
            >
              {`상품사진 ${imgaeToggle.toggle ? '닫기' : '열기'}`}
            </Button>
              {imgaeToggle.toggle && (
              <ImageCarousel
                images={review.images.split(',')
                  .map((image) => getReadableS3MerchandiseImagePath(
                    review.marketerId, review.merchandiseId, image
                  ))}
              />
              )}
          </>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <Typography>{review.contents}</Typography>
      </div>
    </CustomDialog>
  );
}
