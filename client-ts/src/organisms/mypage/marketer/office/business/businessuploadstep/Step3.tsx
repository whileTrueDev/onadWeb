import React from 'react';
import { Typography } from '@material-ui/core';

interface StepperInterface{
  handleChangeStep: (index: number) => void;
  isBusiness: boolean;
}

export default function Step3(props: StepperInterface): JSX.Element {
  const { isBusiness } = props;

  return (
    <div>

      {isBusiness ? (
        <Typography variant="body1" align="center">
         사업자 등록증 업로드가 완료되었습니다. 캐시금액을 입금하신 귀속월 말일에 일괄적으로 전자세금계산서가 발행됩니다.
        </Typography>
      ) : (
        <Typography variant="body1" align="center">
         현금영수증 발행을 위한 전화번호 등록이 완료되었습니다. 금일내로 발행이 진행됩니다.
        </Typography>
      )}
    </div>
  );
}
