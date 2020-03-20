import React from 'react';
import OptionSelectPaper from './sub/OptionSelectPaper';
import CampaignCreateStepLayout from './StepLayout';
import ButtonSet from './sub/ButtonSet';
import {
  Step1Interface,
  Action
} from './campaignReducer';

const options = [
  {
    id: 'option1',
    primaryText: '배너 광고 + 클릭 광고',
    secondaryText: '상품, 브랜드 홍보 뿐 아니라 구매 전환까지 하고 싶어요.',
  },
  {
    id: 'option0',
    primaryText: '배너 광고',
    secondaryText: '상품, 브랜드 홍보만 하고싶어요.',
  },
  {
    id: 'option2',
    primaryText: '클릭 광고',
    secondaryText: '구매 전환을 하고 싶어요.',
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
  id: string;
  primaryText: string;
  secondaryText: string;
}


const OptionPaper = (props: OptionPaperProps): JSX.Element => {
  const {
    state, dispatch, step, handleNext, handleBack // for '다음' 버튼 관리
  } = props;

  // option을 선택하였을 때 event listener
  const handleChange = (id: string) => (): void => {
    dispatch({ key: id, value: '' });
  };

  return (
    <CampaignCreateStepLayout
      primaryText="첫째, &nbsp;&nbsp; 광고 유형 선택"
      secondaryText="해당 광고 캠페인의 유형을 선택하세요."
    >

      {/* optionType 선택 이전 */}
      {step === 0 && (
        <div>
          {options.map((opt: OptionInterface) => (
            <OptionSelectPaper
              key={opt.id}
              primaryText={opt.primaryText}
              secondaryText={opt.secondaryText}
              handleSelect={handleChange(opt.id)}
              checked={state.option === opt.id}
            />
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
