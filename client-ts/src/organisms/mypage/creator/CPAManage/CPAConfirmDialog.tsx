import React from 'react';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography, FormControlLabel, Checkbox
} from '@material-ui/core';

// atoms
import Button from '../../../../atoms/CustomButtons/Button';
import Dialog from '../../../../atoms/Dialog/Dialog';

// types
import {
  CampaignResult, AdpickCampaignStateEnum
} from './AdpickTypes';
// util
import { renderType } from './utilsFunc';

// hooks
import usePatchRequest from '../../../../utils/hooks/usePatchRequest';
import usePostRequest from '../../../../utils/hooks/usePostRequest';
import useToggle from '../../../../utils/hooks/useToggle';
import CPACampaignIcon from './sub/CPACampaignIcon';

const useStyles = makeStyles((theme) => ({
  warningContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2)
  },
  title: {
    fontWeight: 800, margin: `${theme.spacing(1)}px 0px`
  }
}));

interface CPAConfirmDialogProps {
  type: '등록' | '제외';
  title: string;
  open: boolean;
  selectedCampaign: CampaignResult;
  onClose: () => void;
  callback: () => void;
}
export default function CPAConfirmDialog({
  type, title, open, onClose, selectedCampaign, callback
}: CPAConfirmDialogProps): JSX.Element {
  const classes = useStyles();

  // 캠페인 등록 POST 요청
  const campaignStart = usePostRequest(
    '/creator/cpa/adpick/campaign', callback
  );
  // 캠페인 재등록 및 제외 PATCH 요청
  const campaignPatch = usePatchRequest(
    '/creator/cpa/adpick/campaign', callback
  );

  // 유의사항 확인 체크박스
  const confirmCheckbox = useToggle();

  // *********************************************
  // Button Set

  // 등록시 버튼
  const startButtonSet = (
    <>
      <Button
        color="primary"
        onClick={(): void => {
          if (selectedCampaign.campaignState
            && selectedCampaign.campaignState === AdpickCampaignStateEnum.INACTIVE) {
            // 제외 상태인 경우
            campaignPatch.doPatchRequest({
              campaignId: selectedCampaign.apOffer,
              targetState: AdpickCampaignStateEnum.ACTIVE
            });
            onClose();
          } else {
            // 첫 시작인 경우
            campaignStart.doPostRequest({
              campaignId: selectedCampaign.apOffer
            });
            onClose();
          }
        }}
        disabled={!confirmCheckbox.toggle || campaignStart.loading || campaignPatch.loading}
      >
        등록
      </Button>
      <Button onClick={onClose}>취소</Button>
    </>
  );

  // 제외시 버튼
  const stopButtonSet = (
    <>
      <Button
        color="secondary"
        onClick={(): void => {
        // 제외 요청
          campaignPatch.doPatchRequest({
            campaignId: selectedCampaign.apOffer,
            targetState: AdpickCampaignStateEnum.INACTIVE
          });
        }}
        disabled={campaignPatch.loading}
      >
        제외
      </Button>
      <Button onClick={onClose}>취소</Button>
    </>
  );

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={onClose}
      title={`${title} ${type}`}
      buttons={(
        <div>
          {type === '등록' && (<>{startButtonSet}</>)}
          {type === '제외' && (<>{stopButtonSet}</>)}
        </div>
      )}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <CPACampaignIcon src={selectedCampaign.apImages?.icon} />
      </div>
      <Typography variant="body1" className={classes.title}>
        캠페인 명
      </Typography>
      <Typography variant="body2">{selectedCampaign.apAppTitle}</Typography>
      <Typography variant="body1" className={classes.title}>
        캠페인 방식
      </Typography>
      <Typography variant="body2">{renderType(selectedCampaign.apType)}</Typography>
      {selectedCampaign.apHeadline && (
        <>
          <Typography variant="body1" className={classes.title}>
            캠페인 한줄 설명
          </Typography>
            {selectedCampaign.apHeadline.split('\n').map((v) => (
              <Typography variant="body2" key={shortid.generate()}>
                {v}
              </Typography>
            ))}
        </>
      )}
      <Typography variant="body1" className={classes.title}>
        전환시 수익 금액
      </Typography>
      <Typography variant="body2">{`${selectedCampaign.apPayout} 원`}</Typography>

      {/* 등록시 알림 내용 */}
      {type === '등록' && (
      <div className={classes.warningContainer}>
        <Typography>
          해당 캠페인을 광고 페이지에 등록하시겠습니까?
        </Typography>
        <FormControlLabel
          control={(
            <Checkbox
              color="primary"
              checked={confirmCheckbox.toggle}
              onChange={(): void => {
                confirmCheckbox.handleToggle(); // sub url1 칸 열기
              }}
              size="small"
            />
          )}
          label={<Typography variant="caption">캠페인 홍보 유의사항과 미정산 조건을 확인하였습니다.</Typography>}
          labelPlacement="end"
        />
      </div>
      )}

      {/* 제외시 알림 내용 */}
      {type === '제외' && (
      <div className={classes.warningContainer}>
        <Typography>
          해당 캠페인을 광고 페이지에서 제외 하시겠습니까?
        </Typography>
        <Typography variant="caption">
          * 이미 발생한 수익은 그대로 유지됩니다.
        </Typography>
        <Typography variant="caption">
          * 캠페인은 곧바로 재등록이 가능합니다.
        </Typography>
      </div>
      )}
    </Dialog>
  );
}
