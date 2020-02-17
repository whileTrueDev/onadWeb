import React from 'react';
import OptionSelectPaper from './component/OptionSelectPaper';
import CampaignCreateStepLayout from './component/CampaignCreateStepLayout';

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

const OptionPaper = (props) => {
  const {
    state, dispatch,
    setStepComplete, step, // for '다음' 버튼 관리
  } = props;

  // option을 선택하였을 때 event listener
  const handleChange = (event) => {
    // optionType 값 변경을 위해.
    dispatch({ key: event.currentTarget.name });
    // for '다음' 버튼
    setStepComplete(true);
  };

  return (
    <CampaignCreateStepLayout
      primaryText="첫째, &nbsp;&nbsp; 광고 유형 선택"
      secondaryText="해당 광고 캠페인의 유형을 선택하세요."
    >

      {/* optionType 선택 이전 */}
      {step === 0 && (
        <div>
          {options.map(opt => (
            <OptionSelectPaper
              key={opt.id}
              name={opt.id}
              primaryText={opt.primaryText}
              secondaryText={opt.secondaryText}
              handleSelect={handleChange}
              checked={state.option === opt.id}
            />
          ))}
        </div>
      )}

      {/* optionType 선택된 이후 */}
      {step > 0 && (
        <div>
          {options
            .filter(opt => state.option === opt.id)
            .map(selectedOption => (
              <OptionSelectPaper
                key={selectedOption.id}
                name={selectedOption.id}
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

export default OptionPaper;
