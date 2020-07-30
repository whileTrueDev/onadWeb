import React, { useEffect } from 'react';
import { Collapse, Chip } from '@material-ui/core';
import SelectPaper from './shared/SelectPaper';
import CampaignCreateStepLayout from './shared/StepLayout';
import ButtonSet from './shared/ButtonSet';
import CreatorSelect from './AdPriorityComponents/CreatorSelect';
import GameSelect from './AdPriorityComponents/GameSelect';
import {
  CampaignCreateInterface,
  CampaignCreateAction
} from './reducers/campaignCreate.reducer';


export interface PriorityInterface {
  id: string;
  primaryText: string;
  secondaryText: string;
  defaultChildren?: Function;
  completeChildren?: Function;
  customHandleSelect?: Function;
  disabled?: boolean;
}

const priorityTypes: PriorityInterface[] = [
  {
    id: 'type0',
    primaryText: '특정 크리에이터에게만 광고 송출',
    secondaryText: '특정 크리에이터에게만 광고를 송출할 수 있어요',
    defaultChildren: (
      state: CampaignCreateInterface,
      dispatch: React.Dispatch<CampaignCreateAction>,
      handleComplete: () => void,
      handleIncomplete: () => void,
      // setSelectedNames: React.Dispatch<React.SetStateAction<string[]>>
    ): JSX.Element => (
      <Collapse in={state.selectedPriorityType === 'type0'}>
        <CreatorSelect
          state={state}
          dispatch={dispatch}
          priorityType={state.selectedPriorityType}
          handleComplete={handleComplete}
          handleIncomplete={handleIncomplete}
        />
      </Collapse>
    ),
    completeChildren: (data: { selectedCreatorNames: string[] }): JSX.Element => (
      <div>
        {data.selectedCreatorNames.map((creator: string) => (
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
    id: 'type1',
    primaryText: '특정 게임에만 광고 송출',
    secondaryText: '특정 게임에만 광고를 송출할 수 있어요.',
    defaultChildren: (
      state: CampaignCreateInterface,
      dispatch: React.Dispatch<CampaignCreateAction>,
      handleComplete: () => void,
      handleIncomplete: () => void,
    ): JSX.Element => (
      <Collapse in={state.selectedPriorityType === 'type1'}>
        <GameSelect
          state={state}
          dispatch={dispatch}
          handleComplete={handleComplete}
          handleIncomplete={handleIncomplete}
        />
      </Collapse>
    ),
    completeChildren: (data: { selectedGameNames: string[] }): JSX.Element => (
      <div>
        {data.selectedGameNames.map((game: string) => (
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
    secondaryText: ' 최대한 많은 시청자들에게 브랜드를 인지시키고 싶은 광고주님께 추천드립니다.',
  }
];

interface PriorityPaperProps {
  state: CampaignCreateInterface;
  dispatch: React.Dispatch<CampaignCreateAction>; // 우선형 타입 선택
  step: number;
  handleNext: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
function PriorityPaper({
  step, state, dispatch, // 우선형 타입 선택
  handleNext,
  handleBack
}: PriorityPaperProps): JSX.Element {
  // ***************************************************
  // "다음" 버튼 핸들을 위한 상태값.
  const [stepComplete, setStepComplete] = React.useState(false);
  function handleComplete(): void {
    setStepComplete(true);
  }
  function handleIncomplete(): void {
    setStepComplete(false);
  }

  // ***************************************************
  // 우선순위 클릭 핸들러
  const handleSelect = (id: string): void => {
    // 이미 체크되어있는 경우
    if (state.selectedPriorityType === id) {
      handleIncomplete(); // "다음" 버튼 없애기
      dispatch({ type: 'RESET_PRIORITY_TYPE', value: '' });
      dispatch({ type: 'RESET_SELECTED_CREATORS', value: '' });
      dispatch({ type: 'RESET_SELECTED_GAMES', value: '' });
    } else {
      // 새로 체크하는 경우
      dispatch({ type: 'SET_PRIORITY_TYPE', value: id });
      dispatch({ type: 'RESET_SELECTED_CREATORS', value: '' });
      dispatch({ type: 'RESET_SELECTED_GAMES', value: '' });
    }
  };

  useEffect(() => {
    dispatch({ type: 'RESET_SELECTED_CREATORS', value: '' });
    dispatch({ type: 'RESET_SELECTED_GAMES', value: '' });
  }, [dispatch]);

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
                checked={state.selectedPriorityType === type.id}
                handleSelect={(): void => {
                  handleSelect(type.id);
                  if (type.id === 'type2') {
                    handleComplete();
                  }
                }}
              >
                {type.defaultChildren
                  && type.defaultChildren(state, dispatch, handleComplete, handleIncomplete)}
              </SelectPaper>
            ))}
          <ButtonSet
            handleNext={handleNext}
            handleBack={handleBack}
            nextButtonOpen={stepComplete}
          />
        </>
      )}

      {/* 선택된 경우 (step3으로 넘어간 경우) */}
      {step > 1 && (
        <div>
          {priorityTypes
            .filter((type: PriorityInterface) => state.selectedPriorityType === type.id)
            .map((selected: PriorityInterface) => (
              <SelectPaper
                key={selected.id}
                primaryText={selected.primaryText}
                secondaryText={selected.secondaryText}
                checked
                disabled
                innerPaperChildren={(
                  <div>
                    {selected.completeChildren
                      ? selected.completeChildren({
                        selectedCreatorNames: state.selectedCreatorNames,
                        selectedGameNames: state.selectedGames,
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
