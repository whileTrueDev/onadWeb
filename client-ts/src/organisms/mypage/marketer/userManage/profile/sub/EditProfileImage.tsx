import React, { useContext, } from 'react';
import {
  Button,
  makeStyles,
  Typography
} from '@material-ui/core';
import { FiberNew } from '@material-ui/icons';
import EditableAvatar from '../../../../../../atoms/Avatar/EditableAvatar';
import { useDialog } from '../../../../../../utils/hooks';
import CustomDialog from '../../../../../../atoms/Dialog/Dialog';
import MarketerInfoContext from '../../../../../../context/MarketerInfo.context';

const useStyles = makeStyles((theme) => ({
  bold: { fontWeight: 'bold' },
  successIcon: {
    color: theme.palette.success.main,
  },
  button: {
    marginRight: theme.spacing(1)
  }
}));
export interface EditProfileImageProps {
  onSubmit: (value: string) => void;
  loading?: boolean;
}
export default function EditProfileImage({
  onSubmit,
  loading,
}: EditProfileImageProps): JSX.Element {
  const classes = useStyles();
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
        <Typography className={classes.bold}>
          프로필 사진
          {marketerInfo.user && !marketerInfo.user.profileImage && (
          <FiberNew fontSize="small" className={classes.successIcon} />
          )}
        </Typography>
        <Typography color="textSecondary" variant="body2">* 프로필 사진을 클릭해 편집을 시작하세요.</Typography>
        <Typography color="textSecondary" variant="body2">* 프로필 사진은 방송인에게 보여집니다. 브랜드 로고를 프로필 사진으로 사용하는 것이 일반적입니다.</Typography>
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
            className={classes.button}
          >
            확인
          </Button>
          <Button
            variant="contained"
            onClick={confirmDialog.handleClose}
            className={classes.button}
          >
            취소
          </Button>
        </div>
      </CustomDialog>
    </>
  );
}
