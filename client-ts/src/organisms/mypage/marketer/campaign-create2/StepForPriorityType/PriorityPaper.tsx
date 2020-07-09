import React, { useEffect } from 'react';
import SelectPaper from '../shared/SelectPaper';
import CampaignCreateStepLayout from '../shared/StepLayout';
import {
  Step2Interface,
  ArrayAction,
  Action
} from '../campaignReducer';
import priorityTypes, { PriorityInterface } from '../source/priorityTypes';

// 추후에 인터페이스 통합
interface PriorityPaperProps {
  state: Step2Interface;
  dispatch: React.Dispatch<Action>; // 우선형 타입 선택
  checkedPriorityType: string[];
  checkedPriorityTypeDispatch: React.Dispatch<ArrayAction>; // 선택된 크리에이터
  step: number;
}

/**
 * @description
  해당 캠페인의 우선형을 선택한다.
  0: 크리에이터 우선형
  1: 게임 우선형
  2: 노출 우선형

 * @param {*} state ? 우선형을 저장하는 object
 * @param {*} dispatch ? 우선형을 변경하는 func
 * @param {*} checkedPriorityType ? 선택된 크리에이터, 카테고리를 가진 array
 * @param {*} checkedPriorityTypeDispatch ? 크리에이터, 카테고리 선택을 변경하는 func
 * @param {*} step ? 현재의 회원가입 진행상태, 다음 step으로 진행될 때, 선택된 옵션에 대한 렌더링을 위함.
 *
 * @author 박찬우
 */
function PriorityPaper({
  step,
  state, dispatch, // 우선형 타입 선택
  checkedPriorityType, // 선택된 우선순위 타입
  checkedPriorityTypeDispatch,
}: PriorityPaperProps): JSX.Element {
  const [selectedNames, setSelectedNames] = React.useState([]);

  // 우선순위 클릭 핸들러
  const handleSelect = (id: string): void => {
    // 이미 체크되어있는 경우
    if (state.priorityType === id) {
      dispatch({ key: 'reset', value: '' });
      checkedPriorityTypeDispatch({ type: 'reset' });
    } else {
      // 새로 체크하는 경우
      dispatch({ key: id, value: '' });
    }
  };

  useEffect(() => {
    checkedPriorityTypeDispatch({ type: 'reset' });
  }, [checkedPriorityTypeDispatch]);

  return (
    <CampaignCreateStepLayout
      primaryText="둘째,&nbsp;&nbsp; 광고 송출방식 선택"
      secondaryText="해당 캠페인의 송출방식을 선택하세요."
    >
      {/* 아직 선택되지 않은 경우 */}
      {step === 1 && (
        <>
          {priorityTypes // from ../source/priorityTypes.ts
            .map((type: PriorityInterface) => (
              <SelectPaper
                key={type.id}
                primaryText={type.primaryText}
                secondaryText={type.secondaryText}
                disabled={type.disabled}
                checked={state.priorityType === type.id}
                handleSelect={(): void => { handleSelect(type.id); }}
              >
                {type.defaultChildren ? type.defaultChildren(
                  state, checkedPriorityType, checkedPriorityTypeDispatch, setSelectedNames
                ) : null}
              </SelectPaper>
            ))}
        </>
      )}

      {/* 선택된 경우 (step3으로 넘어간 경우) */}
      {step > 1 && (
        <div>
          {priorityTypes
            .filter((type: PriorityInterface) => state.priorityType === type.id)
            .map((selectedPriorityType: PriorityInterface) => (
              <SelectPaper
                key={selectedPriorityType.id}
                primaryText={selectedPriorityType.primaryText}
                secondaryText={selectedPriorityType.secondaryText}
                checked
                disabled
                innerPaperChildren={(
                  <div>
                    {selectedPriorityType.completeChildren
                      ? selectedPriorityType.completeChildren({
                        checkedPriorityType,
                        checkedPriorityTypeDispatch,
                        selectedNames
                      })
                      : null}
                  </div>
                )}
              />
            ))}
        </div>
      )}
    </CampaignCreateStepLayout>
  );
}

export default PriorityPaper;
