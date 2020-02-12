import React from 'react';
import { Collapse, Chip } from '@material-ui/core';
import CreatorSelect from './CreatorSelectCollapse';
import GameSelect from './GameSelect';
import OptionSelectPaper from './component/OptionSelectPaper';
import CampaignCreateStepLayout from './component/CampaignCreateStepLayout';

const priorityTypes = [
  {
    id: 'type0',
    primaryText: '특정 크리에이터에게만 광고 송출',
    secondaryText: '특정 크리에이터에게만 광고를 송출할 수 있어요',
    defaultChildren: (state, setStepComplete, checkedCreators, checkedCreatorsDispatch) => (
      <Collapse in={state.priorityType === 'type0'}>
        <CreatorSelect
          setStepComplete={setStepComplete}
          checkedCreators={checkedCreators}
          checkedCreatorsDispatch={checkedCreatorsDispatch}
        />
      </Collapse>
    ),
    completeChildren: ({ checkedCreators }) => (
      <div>
        {checkedCreators.map(creator => (
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
    defaultChildren: (state, setStepComplete, checkedGames, checkedGamesDispatch) => (
      <Collapse in={state.priorityType === 'type1'}>
        <GameSelect
          setStepComplete={setStepComplete}
          checkedGames={checkedGames}
          checkedGamesDispatch={checkedGamesDispatch}
        />
      </Collapse>
    ),
    completeChildren: ({ checkedGames }) => (
      <div>
        {checkedGames.map(game => (
          <Chip
            key={game}
            label={game}
            color="primary"
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
      setStepComplete(true); // '다음' 버튼 활성화
      if (state.priorityType === 'type2') {
        // 이미 노출우선이 선택되었던 경우 '다음' 버튼 비활성화
        setStepComplete(false);
      }
    },
  }
];

const PriorityPaper = (props) => {
  const {
    state, dispatch, // 우선형 타입 선택
    checkedCreators, checkedCreatorsDispatch, // 선택된 크리에이터
    checkedGames, checkedGamesDispatch, // 선택된 게임
    setStepComplete, step3PaperOpen // 버튼컨트롤 and step 단계에 따른 렌더링 컨트롤
  } = props;

  // priorityType을 선택하였을 때 event listener
  const handleChange = (event) => {
    // 이미 체크되어있는 경우
    if (state.priorityType === event.currentTarget.name) {
      // 선택 초기화
      dispatch({ type: 'reset' });

      // 선택된 크리에이터 목록 초기화
      checkedCreatorsDispatch({ type: 'reset' });

      // 선택된 게임목록 초기화
      checkedGamesDispatch({ type: 'reset' });

      // for '다음' 버튼 비활성화
      setStepComplete(false);
    } else {
      // 이미 체크되어 있지 않은 경우.

      // for '다음' 버튼 비활성화 (크리에이터or게임선택이후 활성화)
      setStepComplete(false);
      dispatch({ type: event.currentTarget.name });
    }
  };

  return (
    <CampaignCreateStepLayout
      primaryText="둘째,&nbsp;&nbsp; 광고 송출방식 선택"
      secondaryText="해당 캠페인의 송출방식을 선택하세요."
    >
      {/* 아직 선택되지 않은 경우 */}
      {!step3PaperOpen && (
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
                checkedCreators, checkedCreatorsDispatch
              ) : null}
            </OptionSelectPaper>
          ))}
        </React.Fragment>
      )}

      {/* 선택된 경우 (step3으로 넘어간 경우) */}
      {step3PaperOpen && (
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
                      ? selectedPriorityType.completeChildren({ checkedCreators, checkedGames })
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
