import { useCallback, useEffect, useState } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { useCertificationMutation } from '../../utils/hooks/mutation/useCertificationMutation';

const useStyles = makeStyles(theme => ({
  contents: { marginTop: theme.spacing(2), marginBottom: theme.spacing(2) },
  button: { width: '100%', marginBottom: theme.spacing(1), marginTop: theme.spacing(1) },
  helperText: { fontWeight: 'bold' },
}));
export interface IndentityVerificationProps {
  onSuccess: () => void;
  onBackClick: () => void;
}
export default function IndentityVerification({
  onSuccess,
  onBackClick,
}: IndentityVerificationProps): JSX.Element {
  const classes = useStyles();
  const [iamportDialogOpen, setIamportDialogOpen] = useState(false);

  const [success, setSuccess] = useState(false);
  const [helperText, setHelperText] = useState('');

  const certificationMutation = useCertificationMutation();
  const submitImpUid = useCallback(
    ({ impUid }) => {
      certificationMutation
        .mutateAsync({ imp_uid: impUid })
        .then(res => {
          const { error, data } = res.data;
          if (error) setHelperText(data.msg || '');
          else {
            setSuccess(true);
            onSuccess();
          }
        })
        .catch(() => {
          setHelperText('본인인증과정에서 오류가 발생헀습니다. support@onad.io로 문의바랍니다.');
        });
    },
    [certificationMutation, onSuccess],
  );

  useEffect(() => {
    if (iamportDialogOpen) {
      const globalParams: any = window;
      const { IMP } = globalParams;
      IMP.init('imp00026649');

      IMP.certification(
        {
          merchant_uid: 'ORD20180131-0000011',
          min_age: '19',
          popup: true,
        },
        (rsp: any) => {
          // callback
          if (rsp.success) {
            submitImpUid({ impUid: rsp.imp_uid });
          }
        },
      );
      setIamportDialogOpen(false);
    }
  }, [iamportDialogOpen, submitImpUid]);

  return (
    <div className={classes.contents}>
      <Typography>본인인증 절차를 완료해주세요.</Typography>
      <div className={classes.contents}>
        <Typography variant="body2">
          자동가입 및 중복 가입 방지를 위해 본인인증 절차가 필요합니다.
        </Typography>

        <div className={classes.contents}>
          {helperText && (
            <Typography color="error" variant="body2" className={classes.helperText}>
              {helperText}
            </Typography>
          )}
          {success && (
            <Typography className={classes.helperText}>본인인증에 성공했습니다!</Typography>
          )}
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              setIamportDialogOpen(true);
            }}
          >
            휴대폰 본인인증 진행하기
          </Button>
          <Button className={classes.button} size="large" variant="contained" onClick={onBackClick}>
            뒤로돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}
