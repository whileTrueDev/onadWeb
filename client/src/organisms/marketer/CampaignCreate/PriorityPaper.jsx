import React from 'react';
import { Collapse, Chip } from '@material-ui/core';
import CreatorSelect from './CreatorSelectCollapse';
import GameSelect from './GameSelect';
import OptionSelectPaper from './component/OptionSelectPaper';
import CampaignCreateStepLayout from './component/CampaignCreateStepLayout';


const PriorityPaper = (props) => {
  const {
    state, dispatch, setStepComplete, creatorList, checkedCreators,
    checkedCreatorsDispatch, stepComplete, step3PaperOpen,
    checkedGames, checkedGamesDispatch
  } = props;

  // priorityType을 선택하였을 때 event listener
  const handleChange = (event) => {
    // priorityType 값 변경을 위해.
    dispatch({ key: event.currentTarget.name });
    // for '다음' 버튼
    setStepComplete(true);
  };

  const checkedPriorityRender = (_priority) => {
    switch (_priority) {
      case 'type0':
        return (
          <OptionSelectPaper
            primaryText="특정 크리에이터에게만 광고 송출"
            secondaryText="단기간에 노출을 많이 하고 싶어요."
            checked
            disabled
          >
            {checkedCreators.map(creator => (
              <Chip
                key={creator}
                label={creator}
                color="primary"
                variant="outlined"
                style={{ margin: 4 }}
              />
            ))}
          </OptionSelectPaper>
        );
      case 'type1':
        return (
          <OptionSelectPaper
            primaryText="3. 노출 우선형"
            secondaryText="단기간에 노출을 많이 하고 싶어요."
            checked
            disabled
          >
            {checkedGames.map(game => (
              <Chip
                key={game}
                label={game}
                color="primary"
                variant="outlined"
                style={{ margin: 4 }}
              />
            ))}
          </OptionSelectPaper>

        );
      case 'type2':
        return (
          <OptionSelectPaper
            primaryText="3. 노출 우선형"
            secondaryText="단기간에 노출을 많이 하고 싶어요."
            checked
            disabled
          />
        );
      default:
        return (
          <div />
        );
    }
  };
  return (
    <CampaignCreateStepLayout
      primaryText="둘째,&nbsp;&nbsp; 광고 송출방식 선택"
      secondaryText="해당 캠페인의 송출방식을 선택하세요."
    >
      {step3PaperOpen && (
        <div>
          {checkedPriorityRender(state.priorityType)}
        </div>
      )}
      {!step3PaperOpen && (
        <React.Fragment>
          <OptionSelectPaper
            name="type0"
            primaryText="특정 크리에이터에게만 광고 송출"
            secondaryText="원하는 크리에이터에게 광고를 송출할 수 있어요."
            handleSelect={handleChange}
            checked={state.priorityType === 'type0'}
          >
            <Collapse in={state.priorityType === 'type0'}>
              <CreatorSelect
                setStepComplete={setStepComplete}
                creatorList={creatorList}
                checkedCreators={checkedCreators}
                checkedCreatorsDispatch={checkedCreatorsDispatch}
                // stepComplete={stepComplete}
              />
            </Collapse>
          </OptionSelectPaper>

          <OptionSelectPaper
            name="type1"
            primaryText="특정 게임에만 광고 송출"
            secondaryText="특정 게임에만 광고를 송출할 수 있어요."
            handleSelect={handleChange}
            checked={state.priorityType === 'type1'}
          >
            <Collapse in={state.priorityType === 'type1'}>
              <GameSelect
                setStepComplete={setStepComplete}
                checkedGames={checkedGames}
                checkedGamesDispatch={checkedGamesDispatch}
              />
            </Collapse>
          </OptionSelectPaper>

          <OptionSelectPaper
            name="type2"
            primaryText="노출 우선"
            secondaryText="별다른 설정없이 노출을 많이 하고 싶어요."
            handleSelect={handleChange}
            checked={state.priorityType === 'type2'}
          />
        </React.Fragment>
      )}
    </CampaignCreateStepLayout>
  );
};

export default PriorityPaper;
