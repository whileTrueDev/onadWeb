import React, { useEffect } from 'react';
import {
  Collapse, Chip
} from '@material-ui/core';
import PropTypes from 'prop-types';
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
        {selectedNames.map((creator) => (
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
    // disabled: true, // 소켓서버 게임 기반 광고 송출 적용 이후 삭제.
    // **************************************************************************

    id: 'type1',
    primaryText: '특정 게임에만 광고 송출',
    secondaryText: '특정 게임에만 광고를 송출할 수 있어요.',
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
        {checkedPriorities.map((game) => (
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
    secondaryText: ` 최대한 많은 시청자들에게 브랜드를 인지시키고 싶은 광고주님께 추천드립니다. 
    `,
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

  useEffect(() => {
    checkedPrioritiesDispatch({ type: 'reset' });
  }, [checkedPrioritiesDispatch, state.priorityType]);

  const [selectedNames, setSelectedNames] = React.useState([]);

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
        <>
          {priorityTypes.map((type) => (
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
          <ButtonSet handleNext={handleNext} handleBack={handleBack} set={complete} />
        </>
      )}

      {/* 선택된 경우 (step3으로 넘어간 경우) */}
      {step > 1 && (
        <div>
          {priorityTypes.filter((type) => state.priorityType === type.id)
            .map((selectedPriorityType) => (
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
            ))}
        </div>
      )}
    </CampaignCreateStepLayout>
  );
};


/**
 * @description
  해당 캠페인의 우선형을 선택한다.
  0: 크리에이터 우선형
  1: 게임 우선형
  2: 노출 우선형

 * @param {*} state ? 우선형을 저장하는 object
 * @param {*} dispatch ? 우선형을 변경하는 func
 * @param {*} checkedPriorities ? 선택된 크리에이터, 카테고리를 가진 array
 * @param {*} checkedPrioritiesDispatch ? 크리에이터, 카테고리 선택을 변경하는 func
 * @param {*} handleBack ? 뒤로 버튼에 연결
 * @param {*} handleNext ? 다음 버튼에 연결
 * @param {*} step ? 현재의 회원가입 진행상태, 다음 step으로 진행될 때, 선택된 옵션에 대한 렌더링을 위함.
 *
 * @author 박찬우
 */
PriorityPaper.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  checkedPriorities: PropTypes.array.isRequired,
  checkedPrioritiesDispatch: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  step: PropTypes.number.isRequired
};

export default PriorityPaper;
