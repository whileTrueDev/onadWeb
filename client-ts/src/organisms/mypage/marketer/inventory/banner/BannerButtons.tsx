import { Button } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';
import React from 'react';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import { useDialog } from '../../../../../utils/hooks';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import Inquire from '../../../../main/main/Inquiry/Inquiry';
import UploadDialog from '../../shared/BannerUploadDialog';
import { BannerDataInterface } from '../interface';

export interface BannerButtonsProps {
  bannerData: UseGetRequestObject<BannerDataInterface[] | null>;
}
export default function BannerButtons({
  bannerData,
}: BannerButtonsProps): JSX.Element {
  const uploadDialog = useDialog();
  const InquireDialog = useDialog();

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={uploadDialog.handleOpen}>
        + 새 배너 등록
      </Button>
      <Button variant="outlined" color="default" onClick={InquireDialog.handleOpen}>
        배너가 없으신가요?
      </Button>
      <Button
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
        recallRequest={bannerData.doGetRequest}
      />

      {/* 배너 생성 가이드 다이얼로그 */}
      <CustomDialog
        open={Boolean(InquireDialog.open)}
        onClose={InquireDialog.handleClose}
        fullWidth
        maxWidth="md"
        buttons={(
          <div>
            <Button onClick={InquireDialog.handleClose}>
              취소
            </Button>
          </div>
        )}
      >
        <Inquire confirmClose={InquireDialog.handleClose} />
      </CustomDialog>
    </div>
  );
}
