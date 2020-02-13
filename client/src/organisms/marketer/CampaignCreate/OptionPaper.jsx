import React from 'react';
import {
  Grid, Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import OptionSelectPaper from './component/OptionSelectPaper';
import CampaignCreateStepLayout from './component/CampaignCreateStepLayout';
import ButtonSet from './component/ButtonSet';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    margin: '12px',
    marginTop: '0px',
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      padding: theme.spacing(1),
    },
  },
  button: {
    marginRight: theme.spacing(1),
  },
  end: {
    color: '#fff',
    marginRight: theme.spacing(1),
  }
}));

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
    state, dispatch, step, handleNext, handleBack // for '다음' 버튼 관리
  } = props;
  const classes = useStyles();

  // option을 선택하였을 때 event listener
  const handleChange = (event) => {
    dispatch({ key: event.currentTarget.name });
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
          <ButtonSet handleNext={handleNext} handleBack={handleBack} step={0} set={Boolean(1)} />
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
