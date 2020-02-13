import React, { useEffect } from 'react';
import {
  Collapse, Chip, Grid, Button
} from '@material-ui/core';
import CreatorSelect from './CreatorSelectCollapse';
import GameSelect from './GameSelect';
import OptionSelectPaper from './component/OptionSelectPaper';
import CampaignCreateStepLayout from './component/CampaignCreateStepLayout';
import ButtonSet from './component/ButtonSet';

const priorityTypes = [
  {
    id: 'type0',
    primaryText: '특정 크리에이터에게만 광고 송출',
    secondaryText: '특정 크리에이터에게만 광고를 송출할 수 있어요',
    defaultChildren: (state, setStepComplete, checkedPriorities, checkedPrioritiesDispatch, setSelectedNames) => (
      <Collapse in={state.priorityType === 'type0'}>
        <CreatorSelect
          setStepComplete={setStepComplete}
          checkedCreators={checkedPriorities}
          checkedCreatorsDispatch={checkedPrioritiesDispatch}
          priorityType={state.priorityType}
          setSelectedNames={setSelectedNames}
        />
      </Collapse>
    ),
    completeChildren: ({ selectedNames }) => (
      <div>
        {selectedNames.map(creator => (
          <Chip
            key={creator}
            label={creator}
            variant="outlined"
            style={{ margin: 4 }}
          />
        ))}
      </div>
    ),
  },
  {

    // *****************************  임시 제거  **********************************
    disabled: true, // 소켓서버 게임 기반 광고 송출 적용 이후 삭제.
    // **************************************************************************

    id: 'type1',
    primaryText: '특정 게임에만 광고 송출',
    secondaryText: '특정 게임에만 광고를 송출할 수 있어요. (곧 지원예정입니다.)',
    defaultChildren: (state, setStepComplete, checkedPriorities, checkedPrioritiesDispatch) => (
      <Collapse in={state.priorityType === 'type1'}>
        <GameSelect
          setStepComplete={setStepComplete}
          checkedGames={checkedPriorities}
          checkedGamesDispatch={checkedPrioritiesDispatch}
          priorityType={state.priorityType}
        />
      </Collapse>
    ),
    completeChildren: ({ checkedPriorities }) => (
      <div>
        {checkedPriorities.map(game => (
          <Chip
            key={game}
            label={game}
            variant="outlined"
            style={{ margin: 4 }}
          />
        ))}
      </div>
    ),
  },
  {
    id: 'type2',
    primaryText: '노출 우선',
    secondaryText: '별다른 설정없이 노출을 많이 하고 싶어요.',
    defaultChildren: null,
    customHandleSelect: (state, setStepComplete) => {
      setStepComplete(state.priorityType !== 'type2');
    }
  }
];

const PriorityPaper = (props) => {
  const {
    state, dispatch, // 우선형 타입 선택
    checkedPriorities, checkedPrioritiesDispatch, // 선택된 크리에이터
    handleBack, handleNext, step
  } = props;
  const [complete, setStepComplete] = React.useState(false);

  useEffect(() => {
    setStepComplete(false);
  }, [step]);

  const [selectedNames, setSelectedNames] = React.useState([]);
  // priorityType을 선택하였을 때 event listener

  const handleChange = (event) => {
    // 이미 체크되어있는 경우
    event.preventDefault();
    if (state.priorityType === event.currentTarget.name) {
      setStepComplete(false);
      dispatch({ type: 'reset' });
      checkedPrioritiesDispatch({ type: 'reset' });
    } else {
      // 새로 체크하는 경우
      dispatch({ type: event.currentTarget.name });
    }
  };

  return (
    <CampaignCreateStepLayout
      primaryText="둘째,&nbsp;&nbsp; 광고 송출방식 선택"
      secondaryText="해당 캠페인의 송출방식을 선택하세요."
    >
      {/* 아직 선택되지 않은 경우 */}
      {step === 1 && (
        <React.Fragment>
          {priorityTypes.map(type => (
            <OptionSelectPaper
              key={type.id}
              name={type.id}
              primaryText={type.primaryText}
              secondaryText={type.secondaryText}
              disabled={type.disabled}
              handleSelect={(evt) => {
                handleChange(evt);
                if (type.customHandleSelect) {
                  type.customHandleSelect(state, setStepComplete);
                }
              }}
              checked={state.priorityType === type.id}
            >
              {type.defaultChildren ? type.defaultChildren(
                state, setStepComplete,
                checkedPriorities, checkedPrioritiesDispatch,
                setSelectedNames
              ) : null}
            </OptionSelectPaper>
          ))}
          <ButtonSet handleNext={handleNext} handleBack={handleBack} step={1} set={complete} />
        </React.Fragment>
      )}

      {/* 선택된 경우 (step3으로 넘어간 경우) */}
      {step > 1 && (
        <div>
          {priorityTypes.filter(type => state.priorityType === type.id)
            .map(selectedPriorityType => (
              <OptionSelectPaper
                key={selectedPriorityType.id}
                name={selectedPriorityType.id}
                primaryText={selectedPriorityType.primaryText}
                secondaryText={selectedPriorityType.secondaryText}
                checked
                disabled
                innerPaperChildren={(
                  <div>
                    {selectedPriorityType.completeChildren
                      ? selectedPriorityType.completeChildren({ checkedPriorities, checkedPrioritiesDispatch, selectedNames })
                      : null}
                  </div>
                )}
              />
            ))
          }
        </div>
      )}
    </CampaignCreateStepLayout>
  );
};

export default PriorityPaper;
