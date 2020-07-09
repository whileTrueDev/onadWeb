import React from 'react';
import { Collapse, Chip } from '@material-ui/core';

import CreatorSelect from '../StepForPriorityType/CreatorSelect';
import GameSelect from '../StepForPriorityType/GameSelect';
import {
  Step2Interface,
  ArrayAction,
} from '../campaignReducer';

export interface PriorityInterface {
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
    defaultChildren: (
      state: Step2Interface,
      checkedPriorityType: string[],
      checkedPriorityTypeDispatch: React.Dispatch<ArrayAction>,
      setSelectedNames: React.Dispatch<React.SetStateAction<string[]>>
    ): JSX.Element => (
      <Collapse in={state.priorityType === 'type0'}>
        <CreatorSelect
          checkedCreators={checkedPriorityType}
          checkedCreatorsDispatch={checkedPriorityTypeDispatch}
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
    id: 'type1',
    primaryText: '특정 게임에만 광고 송출',
    secondaryText: '특정 게임에만 광고를 송출할 수 있어요.',
    defaultChildren: (
      state: Step2Interface,
      checkedPriorityType: string[],
      checkedPriorityTypeDispatch: React.Dispatch<ArrayAction>
    ): JSX.Element => (
      <Collapse in={state.priorityType === 'type1'}>
        <GameSelect
          checkedGames={checkedPriorityType}
          checkedGamesDispatch={checkedPriorityTypeDispatch}
          priorityType={state.priorityType}
        />
      </Collapse>
    ),
    completeChildren: (data: { checkedPriorityType: string[] }): JSX.Element => (
      <div>
        {data.checkedPriorityType.map((game: string) => (
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
  }
];

export default priorityTypes;
