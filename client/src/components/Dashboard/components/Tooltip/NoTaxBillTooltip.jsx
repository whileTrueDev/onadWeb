import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Error from '@material-ui/icons/ErrorOutlined';

const TooltipContents = () => (
  <React.Fragment>
    <span>사업자 등록증을 등록하지 않아</span>
    <br />
    <span>세금계산서가 미발행 되었습니다.</span>
    <br />
    <span>필요시 이메일을 보내주세요. support@onad.io</span>
  </React.Fragment>
);

export default function NoTaxBillTooltip() {
  return (
    <Tooltip
      title={<TooltipContents />}
      placement="right"
      disableFocusListener
    >
      <div><Error /></div>
    </Tooltip>
  );
}
