import { Button, makeStyles } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';
import React from 'react';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import { useDialog } from '../../../../../utils/hooks';
import { UsePaginatedGetRequestObject } from '../../../../../utils/hooks/usePaginatedGetRequest';
import Inquire from '../../../../main/main/Inquiry/Inquiry';
import UploadDialog from '../../shared/BannerUploadDialog';
import { BannerDataInterface } from '../interface';


const useStyles = makeStyles((theme) => ({
  container: { marginBottom: theme.spacing(1) },
  button: { margin: theme.spacing(0, 0.5) },
}));
export interface BannerButtonsProps {
  bannerData: UsePaginatedGetRequestObject<BannerDataInterface>;
}
export default function BannerButtons({
  bannerData,
}: BannerButtonsProps): JSX.Element {
  const classes = useStyles();
  const uploadDialog = useDialog();
  const InquireDialog = useDialog();

  return (
    <div className={classes.container}>
      <Button
        className={classes.button}
        variant="outlined"
        color="primary"
        onClick={uploadDialog.handleOpen}
      >
        + 새 배너 등록
      </Button>
      <Button
        className={classes.button}
        variant="outlined"
        color="default"
        onClick={InquireDialog.handleOpen}
      >
        배너가 없으신가요?
      </Button>
      <Button
        className={classes.button}
        variant="outlined"
        color="primary"
      >
        <GetApp fontSize="small" />
        <a href="/IntroService/온애드배너제작가이드.pdf" download="온애드배너제작가이드">
          배너제작 가이드 다운로드
        </a>
      </Button>

      {/* 배너 업로드 다이얼로그 */}
      <UploadDialog
        open={uploadDialog.open}
        onClose={uploadDialog.handleClose}
        recallRequest={bannerData.request}
      />

      {/* 배너 생성 가이드 다이얼로그 */}
      <CustomDialog
        open={Boolean(InquireDialog.open)}
        onClose={InquireDialog.handleClose}
        fullWidth
        maxWidth="md"
        buttons={(
          <Button onClick={InquireDialog.handleClose} variant="contained">
            취소
          </Button>
        )}
      >
        <Inquire confirmClose={InquireDialog.handleClose} />
      </CustomDialog>
    </div>
  );
}
