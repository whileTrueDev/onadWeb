import React, { useContext, } from 'react';
import {
  Button,
  Typography
} from '@material-ui/core';
import EditableAvatar from '../../../../../../atoms/Avatar/EditableAvatar';
import { useDialog } from '../../../../../../utils/hooks';
import CustomDialog from '../../../../../../atoms/Dialog/Dialog';
import MarketerInfoContext from '../../../../../../context/MarketerInfo.context';

export interface EditProfileImageProps {
  onSubmit: (value: string) => void;
  loading?: boolean;
}
export default function EditProfileImage({
  onSubmit,
  loading,
}: EditProfileImageProps): JSX.Element {
  const marketerInfo = useContext(MarketerInfoContext);
  /**
   * 이미지 업로드 핸들러
   * @param event FormEvent
   */
  function handleProfileImageChange(event: React.FormEvent<HTMLElement>): void {
    const target = event.target as HTMLInputElement;
    const files = (target.files as FileList);
    if (files.length !== 0) {
      const fileRegx = /^image\/[a-z]*$/;
      const myImage = files[0];
      // image 확장자 검사
      if (fileRegx.test(myImage.type)) {
        // 이미지 사이즈 검사
        if (myImage.size < 5 * 1024 * 1024) {
          // 사이즈 제한보다 작은 경우
          const reader = new FileReader();
          reader.readAsDataURL(myImage);
          reader.onload = (): void => {
            if (reader.result) {
              onSubmit(reader.result as string);
            }
          };
        } else {
          // 사이즈 제한보다 큰 경우
          alert('5MB 이하의 이미지를 업로드해주세요.');
        }
      } else {
        alert('파일의 형식이 올바르지 않습니다.');
      }
    }
  }

  // ***********************************************
  // 다이얼로그
  const confirmDialog = useDialog();
  return (
    <>
      <div>
        <Typography style={{ fontWeight: 'bold' }}>프로필 사진</Typography>
        <Typography color="textSecondary" variant="body2">프로필 사진을 클릭해 편집을 시작하세요.</Typography>
        <EditableAvatar
          changeLoading={loading}
          src={marketerInfo.user ? marketerInfo.user.profileImage : ''}
          onProfileImageChange={handleProfileImageChange}
        />
        <Button
          variant="outlined"
          disabled={!marketerInfo.user || !marketerInfo.user.profileImage || loading}
          onClick={(): void => {
            confirmDialog.handleOpen();
          }}
        >
          초기화
        </Button>
      </div>

      <CustomDialog open={confirmDialog.open} onClose={confirmDialog.handleClose} fullWidth maxWidth="xs">
        <Typography>프로필 사진을 초기화 하시겠습니까?</Typography>
        <div style={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={(): void => {
              onSubmit('');
              confirmDialog.handleClose();
            }}
            style={{ marginRight: 8 }}
          >
            확인
          </Button>
          <Button
            variant="contained"
            onClick={confirmDialog.handleClose}
            style={{ marginRight: 8 }}
          >
            취소
          </Button>
        </div>
      </CustomDialog>
    </>
  );
}
