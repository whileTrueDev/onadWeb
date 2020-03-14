import React, { useEffect } from 'react';
import {
  Collapse, Chip
} from '@material-ui/core';
import CreatorSelect from './sub/CreatorSelect';
import GameSelect from './sub/GameSelect';
import OptionSelectPaper from './sub/OptionSelectPaper';
import CampaignCreateStepLayout from './StepLayout';
import ButtonSet from './sub/ButtonSet';
import {
  Step2Interface,
  ArrayAction,
  Action
} from '../../../../pages/mypage/marketer/campaignReducer';

// 추후에 인터페이스 통합
interface propsInterface {
  state: Step2Interface;
  dispatch: React.Dispatch<Action>;  // 우선형 타입 선택
  checkedPriorities: string[];
  checkedPrioritiesDispatch: React.Dispatch<ArrayAction>; // 선택된 크리에이터
  handleBack: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
  step: number;
}

interface PriorityInterface {
  id: string;
  primaryText: string;
  secondaryText: string;
  defaultChildren: Function | null;
  completeChildren?: Function;
  customHandleSelect?: Function;
  disabled?: boolean;
}

const priorityTypes: PriorityInterface[] = [
  {
    id: 'type0',
    primaryText: '특정 크리에이터에게만 광고 송출',
    secondaryText: '특정 크리에이터에게만 광고를 송출할 수 있어요',
    defaultChildren: (state: Step2Interface, setStepComplete: React.Dispatch<React.SetStateAction<boolean>>, checkedPriorities: string[], checkedPrioritiesDispatch: React.Dispatch<ArrayAction>, setSelectedNames: React.Dispatch<React.SetStateAction<string[]>>) => (
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
    completeChildren: (data: { selectedNames: string[] }): JSX.Element => (
      <div>
        {data.selectedNames.map((creator: string) => (
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
    defaultChildren: (state: Step2Interface, setStepComplete: React.Dispatch<React.SetStateAction<boolean>>, checkedPriorities: string[], checkedPrioritiesDispatch: React.Dispatch<ArrayAction>) => (
      <Collapse in={state.priorityType === 'type1'}>
        <GameSelect
          setStepComplete={setStepComplete}
          checkedGames={checkedPriorities}
          checkedGamesDispatch={checkedPrioritiesDispatch}
          priorityType={state.priorityType}
        />
      </Collapse>
    ),
    completeChildren: (data: { checkedPriorities: string[] }): JSX.Element => (
      <div>
        {data.checkedPriorities.map((game: string) => (
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
    customHandleSelect: (state: Step2Interface, setStepComplete: React.Dispatch<boolean>) => {
      setStepComplete(state.priorityType !== 'type2');
    }
  }
];

const PriorityPaper = (props: propsInterface): JSX.Element => {
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

  // TShandleChange
  const handleChange = (id: string) => {
    // 이미 체크되어있는 경우
    if (state.priorityType === id) {
      setStepComplete(false);
      dispatch({ key: 'reset', value: '' });
      checkedPrioritiesDispatch({ type: 'reset' });
    } else {
      // 새로 체크하는 경우
      dispatch({ key: id, value: '' });
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
          {priorityTypes.map((type: PriorityInterface) => (
            <OptionSelectPaper
              key={type.id}
              primaryText={type.primaryText}
              secondaryText={type.secondaryText}
              disabled={type.disabled}
              handleSelect={(event: React.MouseEvent<HTMLButtonElement>) => {
                handleChange(type.id);
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
        </React.Fragment>
      )}

      {/* 선택된 경우 (step3으로 넘어간 경우) */}
      {step > 1 && (
        <div>
          {priorityTypes.filter((type: PriorityInterface) => state.priorityType === type.id)
            .map((selectedPriorityType: PriorityInterface) => (
              <OptionSelectPaper
                key={selectedPriorityType.id}
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

export default PriorityPaper;
