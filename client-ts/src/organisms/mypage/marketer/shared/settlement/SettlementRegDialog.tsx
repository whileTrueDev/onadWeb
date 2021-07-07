import { CircularProgress, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import { usePatchRequest } from '../../../../../utils/hooks';
import {
  SettlementRegDTO,
  useMarketerCreateSettlementMutation,
} from '../../../../../utils/hooks/mutation/useMarketerCreateSettlementMutation';
import { useMarketerSettlement } from '../../../../../utils/hooks/query/useMarketerSettlement';
import SettlementRegForm from './SettlementRegForm';

export interface SettlementRegDialogProps {
  open: boolean;
  onClose: () => void;
}
export default function SettlementRegDialog({
  open,
  onClose,
}: SettlementRegDialogProps): JSX.Element {
  // 판매대금 출금정산을 위한 정산 등록 정보 조회
  const settlement = useMarketerSettlement();

  // * 스낵바
  const { enqueueSnackbar } = useSnackbar();
  const settlementPost = useMarketerCreateSettlementMutation();
  const settlementPatch = usePatchRequest('/marketer/settlement');

  const [loading, setLoading] = useState<boolean>(false);
  function handleLoadingStart(): void {
    setLoading(true);
  }
  function handleLoadingEnd(): void {
    setLoading(false);
  }

  // eslint-disable-next-line consistent-return
  function handleSubmit(
    dto: Partial<SettlementRegDTO>,
    reqType?: 'post' | 'patch',
  ): any | Promise<any> {
    // 제출 핸들링 작성 필요
    const isBusinessman = dto.businessmanFlag === 'true';
    const data = { ...dto, businessmanFlag: isBusinessman };

    if (isBusinessman) {
      if (!data.name) return enqueueSnackbar('회사명을 입력해주세요.', { variant: 'error' });
      if (!data.identificationNumber)
        return enqueueSnackbar('사업자등록번호를 입력해주세요.', { variant: 'error' });
      if (data.identificationNumber.length !== 10)
        return enqueueSnackbar('사업자등록번호 10자리를 입력해주세요.', { variant: 'error' });
    } else {
      if (!data.name) return enqueueSnackbar('성명을 입력해주세요.', { variant: 'error' });
      if (!data.identificationNumber)
        return enqueueSnackbar('주민등록번호를 입력해주세요.', { variant: 'error' });
      if (data.identificationNumber.length !== 13)
        return enqueueSnackbar('주민등록번호를 13자리를 입력해주세요.', { variant: 'error' });
    }

    if (!data.bankName) return enqueueSnackbar('은행을 선택해주세요.', { variant: 'error' });
    if (!data.bankAccountOwner)
      return enqueueSnackbar('예금주를 입력해주세요.', { variant: 'error' });
    if (data.bankAccountNumber && data.bankAccountNumber.includes('-'))
      return enqueueSnackbar('계좌번호에는 - 가 포함될 수 없습니다.', { variant: 'error' });
    if (!data.bankAccountNumber)
      return enqueueSnackbar('계좌번호를 입력해주세요.', { variant: 'error' });
    if (isBusinessman) {
      if (!data.identificationImgSrc)
        return enqueueSnackbar('사업자등록증을 업로드해주세요.', { variant: 'error' });
    } else if (!data.identificationImgSrc)
      return enqueueSnackbar('신분증을 업로드해주세요.', { variant: 'error' });
    if (!data.bankAccountImgSrc)
      return enqueueSnackbar('통장 사본을 업로드해주세요.', { variant: 'error' });

    const onSuccess = (res: any): void => {
      handleLoadingEnd();
      if (res.data === 1) {
        enqueueSnackbar('정산 등록이 완료되었습니다.', { variant: 'success' });
        onClose();
      } else {
        enqueueSnackbar(
          '정산 등록중 오류가 발생했습니다. 문제가 지속되는 경우 support@onad.io로 문의 바랍니다.',
          { variant: 'error' },
        );
      }
    };

    const onFail = (err: any): void => {
      handleLoadingEnd();
      enqueueSnackbar(
        '정산 등록중 오류가 발생했습니다. 문제가 지속되는 경우 support@onad.io로 문의 바랍니다.',
        { variant: 'error' },
      );
      console.error(err);
    };

    handleLoadingStart();
    if (reqType && reqType === 'patch') {
      return settlementPatch.doPatchRequest(data).then(onSuccess).catch(onFail);
    }
    return settlementPost.mutateAsync(data).then(onSuccess).catch(onFail);
  }

  return (
    <>
      <CustomDialog fullWidth maxWidth="sm" open={open} onClose={onClose} title="정산 등록">
        {settlement?.data && (
          <Alert severity="error">
            <Typography variant="body2">
              * 정산 등록을 수정하면 다시 검수과정을 거치게 됩니다.
            </Typography>
            <Typography variant="body2">
              * 파일 등록을 변경하지 않으시는 경우, &quot;선택된 파일 없음&quot;으로 표시되는 것과
              관계없이 파일을 다시 업로드하지 않으셔도 됩니다.
            </Typography>
          </Alert>
        )}
        <SettlementRegForm onSubmit={handleSubmit} onCancle={onClose} loading={loading} />

        {(settlementPatch.loading || settlementPost.isLoading) && <CircularProgress />}
      </CustomDialog>
    </>
  );
}
