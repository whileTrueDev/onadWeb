import React from 'react';
import { Collapse } from '@material-ui/core';
import OptionSelectPaper from './sub/OptionSelectPaper';
import CampaignCreateStepLayout from './StepLayout';
import ButtonSet from './sub/ButtonSet';
import AdDescriptionSelect from './sub/AdDescriptionSelect';
import AdDescriptionDialog from './sub/AdDescriptionDialog';
import { Step1Interface, Action } from './campaignReducer';
import useDialog from '../../../../utils/hooks/useDialog';

const options = [
  {
    id: 'option1',
    primaryText: '온애드 생방송 배너 광고',
    secondaryText: `실시간 방송 중인 크리에이터를 매칭하여 송출되는 광고로
    뛰어난 방송화면 내 장시간의 노출로 브랜드 인지 각인 효과가 큽니다.
    10분마다 광고 전환-롤링 되며, 시청자 노출 수에 기반하여 과금되는 합리적 비용구조를 가지고 있습니다.`,
    materials: [
      { name: '생방송 송출 배너', description: '', lastDesc: '' },
      { name: '클릭 배너', description: '', lastDesc: '' },
      { name: '챗봇', description: '', lastDesc: '' }
    ]
  },
  {
    id: 'option0',
    primaryText: '온애드-배너 업로드형 광고',
    secondaryText: '추가 예정입니다.',
  },
];

// 추후에 인터페이스 통합
interface OptionPaperProps {
  state: Step1Interface;
  dispatch: React.Dispatch<Action>; // 우선형 타입 선택
  handleBack: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
  step: number;
}
interface OptionInterface {
  id: string; primaryText: string; secondaryText: string;
  materials?: { name: string; description: string; lastDesc: string }[];
}
const OptionPaper = (props: OptionPaperProps): JSX.Element => {
  const {
    state, dispatch, step, handleNext, handleBack, // for '다음' 버튼 관리
  } = props;

  // option을 선택하였을 때 event listener
  const handleChange = (id: string) => (): void => {
    dispatch({ key: id, value: '' });
  };

  // 광고 유형 선택 - 광고 구성 설명 다이얼로그
  const adDescriptionDialog = useDialog();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <CampaignCreateStepLayout
      primaryText="첫째, &nbsp;&nbsp; 광고 유형 선택"
      secondaryText="해당 광고 캠페인의 유형을 선택하세요."
    >

      {/* optionType 선택 이전 */}
      {step === 0 && (
        <div>
          {options.map((opt: OptionInterface, index) => (
            <OptionSelectPaper
              key={opt.id}
              primaryText={opt.primaryText}
              secondaryText={opt.secondaryText}
              handleSelect={handleChange(opt.id)}
              checked={state.option === opt.id}
              // disabled={opt.id === 'option0'}
            >
              {opt.materials && (
              <Collapse in={state.option === opt.id}>
                <AdDescriptionSelect
                  primary={opt.primaryText}
                  materials={opt.materials}
                  handleMaterialClick={(): void => {
                    setSelectedIndex(index);
                    adDescriptionDialog.handleOpen();
                  }}
                />
              </Collapse>
              )}
            </OptionSelectPaper>
          ))}
          <ButtonSet handleNext={handleNext} handleBack={handleBack} set={Boolean(1)} />
        </div>
      )}

      {/* optionType 선택된 이후 */}
      {step > 0 && (
        <div>
          {options
            .filter((opt) => state.option === opt.id)
            .map((selectedOption) => (
              <OptionSelectPaper
                key={`${selectedOption.id}`}
                primaryText={selectedOption.primaryText}
                secondaryText={selectedOption.secondaryText}
                checked
                disabled
              />
            ))}
        </div>
      )}

      {adDescriptionDialog.open && options[selectedIndex].materials && (
      <AdDescriptionDialog
        open={adDescriptionDialog.open}
        onClose={adDescriptionDialog.handleClose}
      />
      )}

    </CampaignCreateStepLayout>
  );
};


/**
 * @description
  해당 캠페인의 송출옵션을 선택한다.
  0: CPM
  1: CPM + CPC
  2: CPC

 * @param {*} state ? 송출옵션을 저장하는 object
 * @param {*} dispatch ? 송출옵션을 변경하는 func
 * @param {*} handleBack ? 뒤로 버튼에 연결
 * @param {*} handleNext ? 다음 버튼에 연결
 * @param {*} step ? 현재의 회원가입 진행상태, 다음 step으로 진행될 때, 선택된 옵션에 대한 렌더링을 위함.
 *
 * @author 박찬우
 */
export default OptionPaper;
