import { Button, TextField, Typography } from '@material-ui/core';
import { OpenInNew, Refresh } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import HOST from '../../../../../config';
import axiosInstance from '../../../../../utils/axios';
import copyToClipboard from '../../../../../utils/copyToClipboard';
import { useCreatorLinkAfreecaCert } from '../../../../../utils/hooks/query/useCreatorLinkAfreecaCert';

export interface AfreecaLinkDialogProps {
  afreecaId: {
    value: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  open: boolean;
  onClose: () => void;
}
export default function AfreecaLinkDialog({
  afreecaId,
  open,
  onClose,
}: AfreecaLinkDialogProps): JSX.Element {
  const AFREECA_ONAD_ID_LINK_NOTE = '온애드 (kmotiv)';
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const afreecaLink = useCreatorLinkAfreecaCert();

  // 아프리카 연동 인증번호
  const [certCode, setCertCode] = useState('');
  function handleCertCode(cert: string): void {
    setCertCode(cert);
  }
  useEffect(() => {
    // 이미 아프리카 연동을 진행한 경우 앞전에 생성된 인증코드를 설정
    if (afreecaLink.data) {
      setCertCode(afreecaLink.data.tempCode);
    }
  }, [afreecaLink.data]);

  // 아프리카 연동 요청
  function handleAfreecaClick(): void {
    axiosInstance
      .post(`${HOST}/link/afreeca/cert`, {
        afreecaId: afreecaId.value,
      })
      .then(res => {
        // 아프리카 연동 요청 목록 재요청 (parent 컴포넌트를 위해)
        queryClient.invalidateQueries('creatorLinkAfreecaCert');

        // *************************************************
        const { status } = res.data;
        if (status === 'already-linked') {
          // 이미 다른유저에게 연동 된 경우
          enqueueSnackbar(`${afreecaId.value}는 이미 다른 유저에게 연동되어있습니다.`, {
            variant: 'error',
          });
        } else if (status === 'duplicate-request') {
          // 이미 아프리카 연동 진행을 했다 + 아직 쪽지를 보내지 않은 경우
          handleCertCode(res.data.cert.tempCode);
        } else if (status === 'created') {
          // 이외의 경우 => 연동 인증번호가 생성
          handleCertCode(res.data.cert.tempCode);
        }
      })
      .catch(() => {
        enqueueSnackbar('인증번호를 발급하는 중 오류가 발생했습니다. 잠시후 다시 시도해 주세요', {
          variant: 'error',
        });
        console.error('err');
      });
  }

  // 쪽지 바로 보내기 버튼 클릭 여부
  const [isClicked, setIsClicked] = useState(false);
  function handleButtonClicked() {
    setIsClicked(!isClicked);
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
      <Typography variant="body2">
        3. 복사한 인증번호를 afreecaTV에서 온애드에게 쪽지로 보내주세요.
      </Typography>
      <Typography variant="body2">4. 인증번호를 확인하는 데에 3~5분이 걸릴 수 있습니다.</Typography>

      <div style={{ marginTop: 16 }}>
        {!certCode ? (
          <div>
            <TextField
              helperText="아프리카tv로그인시 입력하는 ID를 입력해주세요 (오타를 주의해주세요)"
              inputProps={{
                maxLength: 12, // 아프리카 회원가입시 아이디 입력 12자리 까지로 제한됨.
              }}
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
              {afreecaId.value || afreecaLink.data?.afreecaId} 연동 진행중입니다.
            </Typography>
            <Typography variant="body2">아래 설명에 따라 진행해주세요.</Typography>
          </div>
        )}

        {certCode && (
          <Alert severity="info">
            <Typography variant="body2">
              아래 인증번호를 &quot;
              <Typography component="span" color="error">
                {AFREECA_ONAD_ID_LINK_NOTE}
              </Typography>
              &quot; 에게 쪽지로 보내주세요.
            </Typography>
            <Typography variant="body2">쪽지를 보낸 이후 3~5분 정도 기다려 주세요.</Typography>
            <Typography variant="caption">
              - 온애드에서 쪽지를 인증하기까지 5분 정도 시간이 걸릴 수 있습니다.
            </Typography>
            <br />
            <Typography variant="caption">
              - 현재 창을 닫고 새로고침 버튼을 눌러 경과를 확인할 수 있습니다.
            </Typography>
            <div style={{ textAlign: 'center', margin: '16px 0px' }}>
              <TextField
                fullWidth
                value={certCode}
                id="afreeca-cert-code"
                helperText="인증번호 클릭시 복사됩니다."
                onClick={(e): void =>
                  copyToClipboard(e, 'afreeca-cert-code', () =>
                    enqueueSnackbar(
                      `인증번호가 복사되었습니다. ${AFREECA_ONAD_ID_LINK_NOTE} 에게 복사된 인증번호를 쪽지로 보내주세요.`,
                      { variant: 'success' },
                    ),
                  )
                }
              />
            </div>

            {/* 아프리카 쪽지창으로 이동하기 버튼 */}
            <Button
              style={{ marginTop: 8 }}
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                window.open('http://note.afreecatv.com/app/index.php?page=write');
                handleButtonClicked();
              }}
            >
              쪽지 바로 보내기
              <OpenInNew fontSize="small" style={{ verticalAlign: 'middle' }} />
            </Button>

            {isClicked && (
              <div style={{ marginTop: 8 }}>
                <Typography variant="body2">
                  쪽지를 올바르게 보내셨다면 창을 닫고 잠시 기다려주세요.
                </Typography>
                <Typography variant="body2">
                  <Typography variant="body2" component="span" color="primary">
                    새로고침
                    <Refresh fontSize="small" />
                  </Typography>
                  버튼을 통해 경과를 확인할 수 있습니다.
                </Typography>
                <Button
                  style={{ marginTop: 8, float: 'right' }}
                  variant="contained"
                  color="default"
                  onClick={onClose}
                >
                  창닫기
                </Button>
              </div>
            )}
          </Alert>
        )}
      </div>
    </CustomDialog>
  );
}
