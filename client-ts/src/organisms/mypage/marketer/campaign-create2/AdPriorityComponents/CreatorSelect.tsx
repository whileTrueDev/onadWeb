import { useEffect } from 'react';
import * as React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Chip, Grid, Typography } from '@material-ui/core';
import CreatorTable from './CreatorSelectTable';
import {
  CampaignCreateInterface,
  CampaignCreateAction,
  CampaignSelectedCreator,
} from '../reducers/campaignCreate.reducer';
import { CreatorDetailDataInterface } from '../../../../../utils/hooks/query/useCreatorsAnalysisDetail';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    marginTop: '0px',
    alignItem: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  bold: {
    fontWeight: theme.typography.fontWeightBold,
  },
  chip: { margin: theme.spacing(0.5) },
}));

interface CreatorSelectProps {
  state: CampaignCreateInterface;
  dispatch: React.Dispatch<CampaignCreateAction>;
  handleComplete: () => void;
  handleIncomplete: () => void;
  priorityType?: string;
}
const CreatorSelect = (props: CreatorSelectProps): JSX.Element => {
  const { state, dispatch, handleComplete, handleIncomplete } = props;
  const classes = useStyles();

  // **********************************************************
  // "다음" 버튼 핸들러
  useEffect(() => {
    if (state.selectedPriorityType !== 'type0') {
      return;
    }
    if (state.selectedCreators.length >= 1) {
      handleComplete();
    } else {
      handleIncomplete();
    }
  }, [handleComplete, handleIncomplete, state.selectedCreators.length, state.selectedPriorityType]);

  // **********************************************************
  // 선택된 크리에이터인지 확인하는 함수
  const isCheckedCreator = (creatorId: string): boolean => {
    if (state.selectedCreators.filter(c => c.creatorId === creatorId).length > 0) return true;
    return false;
  };
  // 크리에이터 선택 해제 핸들러
  const handleCreatorSelectCancel = (creator: CampaignSelectedCreator): void =>
    dispatch({
      type: 'DELETE_SELECTED_CREATORS',
      value: { creatorId: creator.creatorId, creatorName: creator.creatorName },
    });
  // 크리에이터 선택 핸들러
  const handleCreatorSelect = (rowData?: CreatorDetailDataInterface): void => {
    if (rowData) {
      const { creatorId, creatorName, creatorIdAfreeca, afreecaName } = rowData;
      if (isCheckedCreator(creatorId || creatorIdAfreeca)) {
        // 체크 된 걸 다시 체크할 때
        handleCreatorSelectCancel({
          creatorId: creatorId || creatorIdAfreeca,
          creatorName: creatorName || afreecaName || '',
        });
      } else {
        // 체크 됐을 때
        dispatch({
          type: 'SET_SELECTED_CREATORS',
          value: {
            creatorId: creatorId || creatorIdAfreeca,
            creatorName: creatorName || afreecaName,
          },
        });
      }
    }
  };

  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <Typography variant="body1" className={classes.bold}>
          현재까지 선택된 방송인 :{' '}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          * 표에서 방송인 클릭시 선택됩니다.
        </Typography>
        {state.selectedCreators.map(creator => (
          <Chip
            className={classes.chip}
            label={creator.creatorName}
            key={creator.creatorName}
            color="primary"
            onDelete={(): void => handleCreatorSelectCancel(creator)}
          />
        ))}
      </Grid>
      <Grid item>
        <CreatorTable onCreatorSelect={handleCreatorSelect} isCheckedCreator={isCheckedCreator} />
      </Grid>
    </Grid>
  );
};

/**
 * @description
  해당 캠페인의 우선형을 크리에이터 우선형으로 선택하여 송출될 크리에이터의 데이터를 확인하고 선택하기 위한 컴포넌트

 * @param {*} checkedCreators ? 상위 컴포넌트로 넘기기 위한 선택된 크리에이터의 list
 * @param {*} dispatch ? 상위 컴포넌트로 넘기기 위한 선택된 크리에이터를 저장하는 func
 * @param {*} setSelectedNames ? 선택된 크리에이터를 보여주기 위한 크리에이터 이름 list를 저장하는 func
 * @param {*} priorityType ? 노출 우선형일 경우 list의 저장을 continue하기 위한 state

 * @author 박찬우
 */

export default CreatorSelect;
