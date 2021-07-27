/* eslint-disable max-len */
import { Switch, SwitchProps, Tooltip } from '@material-ui/core';
import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { CampaignInterface } from '../../organisms/mypage/marketer/dashboard/interfaces';
import { useMarketerCampaignOnOffMutation } from '../../utils/hooks/mutation/useMarketerCampaignOnOffMutation';
import {
  CONFIRM_STATE_REJECTED,
  CONFIRM_STATE_WAIT,
} from '../../utils/render_funcs/renderUrlConfirmState';

export interface CampaignOnOffSwitchProps extends SwitchProps {
  campaign: CampaignInterface;
  onSuccess: (data: any) => void;
  onFail: (err: any) => void;
  size?: SwitchProps['size'];
  id?: SwitchProps['id'];
  color?: SwitchProps['color'];
  inventoryLoading?: boolean;
}

const LIVE_BANNER_OPTION_TYPE = 1; // 생방송 라이브 배너광고 Option Type
const CPS_OPTION_TYPE = 3; // 상품판매형 CPS Option Type
export default function CampaignOnOffSwitch(props: CampaignOnOffSwitchProps): React.ReactElement {
  const {
    campaign,
    onSuccess,
    onFail,
    size = 'small',
    id = 'onoff-switch',
    color = 'primary',
    inventoryLoading,
  } = props;

  // **********************************************
  // 로딩 처리를 위해
  const onOffMutation = useMarketerCampaignOnOffMutation();
  const handleSwitch = useCallback((): void => {
    onOffMutation
      .mutateAsync({
        onoffState: !campaign.onOff,
        campaignId: campaign.campaignId,
      })
      .then(({ data }) => onSuccess(data))
      .catch(err => onFail(err));
  }, [campaign.campaignId, campaign.onOff, onFail, onOffMutation, onSuccess]);

  // **********************************************
  // 캠페인 시작이 불가능할 때, 버튼 disable 처리
  const [onOffDisableReason, setOnOffDisableReason] = useState<string>('현재 송출 불가');
  function handleOnOffDisable(reason: string): void {
    setOnOffDisableReason(reason);
  }

  const onOffDisabled = useMemo((): boolean => {
    if (!campaign.onOff && !campaign.confirmState) {
      handleOnOffDisable('캠페인의 배너가 승인되지 않았습니다.');
      return true;
    }
    // 생방송 라이브 배너광고의 경우
    if (campaign.optionType === LIVE_BANNER_OPTION_TYPE) {
      if (!campaign.onOff && campaign.linkConfirmState === CONFIRM_STATE_REJECTED) {
        handleOnOffDisable('캠페인의 랜딩페이지URL이 거절되었습니다.');
        return true;
      }

      if (!campaign.onOff && campaign.linkConfirmState === CONFIRM_STATE_WAIT) {
        handleOnOffDisable('캠페인의 랜딩페이지URL이 아직 승인되지 않았습니다.');
        return true;
      }
    }
    // CPS 캠페인인 경우
    if (campaign.optionType === CPS_OPTION_TYPE) {
      // 현재 off 상태이면서 온애드샵에 아직 업로드 되지 않았거나, 상품이 없거나, 온애드샵 사이트 URL이 아직 업로드 되지 않은 경우
      if (
        !campaign.onOff &&
        (!campaign.merchandiseUploadState ||
          !campaign.merchandiseId ||
          !campaign.merchandiseItemSiteUrl)
      ) {
        let message = '아직 온애드샵에 상품이 업로드되지 않았습니다.';
        if (campaign.merchandiseUploadState === 0 && campaign.merchandiseDenialReason)
          message = '상품이 거절된 캠페인입니다.';
        handleOnOffDisable(message);
        return true;
      }
      // off 상태이면서 상품의 남은 재고가 없는 경우
      if (
        !campaign.onOff &&
        campaign.merchandiseStock &&
        campaign.merchandiseSoldCount &&
        !(campaign.merchandiseStock - campaign.merchandiseSoldCount > 0)
      ) {
        handleOnOffDisable('상품 판매 재고를 모두 소진하였습니다.');
        return true;
      }
    }
    return false;
  }, [
    campaign.confirmState,
    campaign.linkConfirmState,
    campaign.merchandiseDenialReason,
    campaign.merchandiseId,
    campaign.merchandiseItemSiteUrl,
    campaign.merchandiseSoldCount,
    campaign.merchandiseStock,
    campaign.merchandiseUploadState,
    campaign.onOff,
    campaign.optionType,
  ]);

  const switchButton = useMemo(
    () => (
      <Switch
        size={size}
        id={id}
        color={color}
        disabled={inventoryLoading || onOffMutation.isLoading || onOffDisabled}
        checked={Boolean(campaign.onOff)}
        onChange={handleSwitch}
      />
    ),
    [
      campaign.onOff,
      color,
      handleSwitch,
      id,
      inventoryLoading,
      onOffMutation.isLoading,
      onOffDisabled,
      size,
    ],
  );

  if (onOffDisabled) {
    return (
      <Tooltip title={onOffDisableReason} arrow>
        <div>{switchButton}</div>
      </Tooltip>
    );
  }

  return switchButton;
}
