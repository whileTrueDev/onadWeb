import { Button, TextField, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { OpenInNew } from '@material-ui/icons';
import HOST from '../../../../../config';
import axiosInstance from '../../../../../utils/axios';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import { useDialog, useEventTargetValue } from '../../../../../utils/hooks';
import Snackbar from '../../../../../atoms/Snackbar/Snackbar';

export interface AfreecaLinkData {
  tempCode: string;
  creatorId: string;
  afreecaId: string;
  certState: number;
  createdAt: string;
}
export interface AfreecaLinkDialogProps {
  open: boolean;
  onClose: () => void;
  afreecaLinkData?: AfreecaLinkData;
  afreecaLinkDataRefetch: () => void;
}
export default function AfreecaLinkDialog({
  open,
  onClose,
  afreecaLinkData,
  afreecaLinkDataRefetch,
}: AfreecaLinkDialogProps): JSX.Element {
  // 연동하고자 하는 아프리카 ID (사용자입력)
  const afreecaId = useEventTargetValue();
  // 아프리카 연동 인증번호
  const [certCode, setCertCode] = useState('');
  function handleCertCode(cert: string): void {
    setCertCode(cert);
  }
  useEffect(() => {
    // 이미 아프리카 연동을 진행한 경우 앞전에 생성된 인증코드를 설정
    if (afreecaLinkData) {
      setCertCode(afreecaLinkData.tempCode);
    }
  }, [afreecaLinkData]);


  const failsnack = useDialog();
  // 아프리카 연동 요청
  function handleAfreecaClick(): void {
    axiosInstance.post(`${HOST}/link/afreeca`, {
      afreecaId: 'orangene11'
    })
      .then((res) => {
        // 아프리카 연동 요청 목록 재요청 (parent 컴포넌트를 위해)
        afreecaLinkDataRefetch();

        // *************************************************
        const { status } = res.data;
        if (status === 'already-linked') {
          // 이미 다른유저에게 연동 된 경우
        } else if (status === 'duplicate-request') {
          // 이미 아프리카 연동 진행을 했다 + 아직 쪽지를 보내지 않은 경우
          handleCertCode(res.data.cert.tempCode);
        } else if (status === 'created') {
          // 이외의 경우 => 연동 인증번호가 생성
          handleCertCode(res.data.cert.tempCode);
        }
      })
      .catch(() => {
        failsnack.handleOpen();
        console.error('err');
      });
  }

  return (
    <CustomDialog
      maxWidth="xs"
      fullWidth
      title="아프리카 연동 작업 진행"
      open={open}
      onClose={onClose}
    >
      <Typography variant="body2">1. 본인의 아프리카TV 아이디를 입력해주세요.</Typography>
      <Typography variant="body2">2. 인증번호를 발급하고 복사해주세요.</Typography>
      <Typography variant="body2">3. 복사한 인증번호를 afreecaTV에서 온애드에게 쪽지로 보내주세요.</Typography>
      <Typography variant="body2">4. 인증번호를 확인하는 데에 3~5분이 걸릴 수 있습니다.</Typography>

      <div style={{ marginTop: 16 }}>
        {!certCode ? (
          <div>
            <TextField
              helperText="아프리카tv로그인시 입력하는 ID를 입력해주세요"
              fullWidth
              value={afreecaId.value}
              onChange={afreecaId.handleChange}
              variant="outlined"
            />
            <Button
              style={{ margin: '16px 0px' }}
              fullWidth
              onClick={handleAfreecaClick}
              color="primary"
              variant="contained"
              disabled={!afreecaId.value}
            >
              인증번호 발급 요청
            </Button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', margin: '16px 0px' }}>
            <Typography style={{ fontWeight: 'bold' }}>
              {afreecaId.value || afreecaLinkData?.afreecaId}
              {' '}
              연동 진행중입니다.
            </Typography>
            <Typography variant="body2">아래 설명에 따라 진행해주세요.</Typography>
          </div>
        )}

        {certCode && (
        <Alert severity="info">
          <Typography variant="body2">
            아래 인증번호를 &quot;
            <Typography component="span" color="error">
              kmotiv
            </Typography>
            &quot; 에게 쪽지로 보내주세요.
          </Typography>
          <Typography variant="caption">- 온애드에서 쪽지를 인증하기까지 5분정도 시간이 걸릴 수 있습니다.</Typography>
          <br />
          <Typography variant="caption">- 현재 창을 닫아도 인증은 진행됩니다.</Typography>
          <div style={{ textAlign: 'center', margin: '16px 0px' }}>
            <Typography
              variant="body1"
              style={{ textDecoration: 'underline', fontWeight: 'bold' }}
            >
              {certCode}
            </Typography>
          </div>
          <Button
            style={{ marginTop: 8 }}
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => { window.open('http://note.afreecatv.com/app/index.php'); }}
          >
            아프리카TV 쪽지창으로 이동
            <OpenInNew fontSize="small" />
          </Button>
        </Alert>
        )}
      </div>

      <Snackbar
        open={failsnack.open}
        onClose={failsnack.handleClose}
        color="error"
        message="인증번호를 발급하는 중 오류가 발생했습니다. 잠시후 다시 시도해 주세요"
      />

    </CustomDialog>
  );
}
