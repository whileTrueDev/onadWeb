import {
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Select,
  Typography,
} from '@material-ui/core';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import * as React from 'react';
import { useEffect } from 'react';
import { useCreatorsAnalysisGames } from '../../../../../utils/hooks/query/useCreatorsAnalysisGames';
import { CampaignCreateAction, CampaignCreateInterface } from '../reducers/campaignCreate.reducer';
import GameCard from './gameSelectCard';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    marginTop: '0px',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  formControl: { margin: theme.spacing(1), minWidth: 120, maxWidth: 300 },
}));

interface GameSelectProps {
  state: CampaignCreateInterface;
  dispatch: React.Dispatch<CampaignCreateAction>;
  handleComplete: () => void;
  handleIncomplete: () => void;
}

const GameSelect = (props: GameSelectProps): JSX.Element => {
  const { state, dispatch, handleComplete, handleIncomplete } = props;
  const classes = useStyles();
  const theme = useTheme();

  // **********************************************************
  // 게임데이터 로딩 및 클릭 핸들러
  const games = useCreatorsAnalysisGames();
  function handleGameClick(game: string): void {
    if (state.selectedGames.includes(game)) {
      dispatch({ type: 'DELETE_SELECTED_GAMES', value: game });
    } else {
      dispatch({ type: 'SET_SELECTED_GAMES', value: game });
    }
  }

  // **********************************************************
  // "다음" 버튼 핸들러
  useEffect(() => {
    if (state.selectedPriorityType !== 'type1') {
      return;
    }
    if (state.selectedGames.length >= 1) {
      handleComplete();
    } else {
      handleIncomplete();
    }
  }, [handleComplete, handleIncomplete, state.selectedGames.length, state.selectedPriorityType]);

  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item xs={12} lg={8} xl={6}>
        <Typography variant="h6">광고를 송출하려는 카테고리를 선택해주세요.</Typography>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body2" color="textSecondary">
          * 상위 12개의 카테고리는 온애드 방송인이 가장 많이 진행하는 방송 카테고리입니다.
        </Typography>
        <br />
      </Grid>

      <Grid item xs={12}>
        {games.isLoading && (
          <div style={{ padding: 72, textAlign: 'center' }}>
            <CircularProgress size={100} disableShrink />
          </div>
        )}
        {!games.isLoading && games.data && (
          <Grid container spacing={2} style={{ flexWrap: 'wrap' }}>
            {games.data.slice(0, 12).map(game => (
              <Grid key={game.gameId} item xs={4} md={3} xl={2}>
                <GameCard
                  gameName={game.gameName}
                  gameNameKr={game.gameNameKr}
                  count={game.count}
                  boxArt={game.boxArt}
                  handleClick={(): void => {
                    handleGameClick(game.gameName);
                  }}
                  backgroundColor={
                    state.selectedGames.includes(game.gameName)
                      ? theme.palette.primary.light
                      : 'inherit'
                  }
                  color={
                    state.selectedGames.includes(game.gameName)
                      ? theme.palette.common.white
                      : 'inherit'
                  }
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="grouped-native-select">기타 게임 선택</InputLabel>
                <Select
                  defaultValue=""
                  native
                  input={<Input id="grouped-native-select" />}
                  onChange={(
                    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
                  ): void => {
                    if (typeof event.target.value === 'string') {
                      if (!state.selectedGames.includes(event.target.value)) {
                        if (event.target.value) {
                          dispatch({ type: 'SET_SELECTED_GAMES', value: event.target.value });
                        }
                      } else if (event.target.value) {
                        dispatch({ type: 'DELETE_SELECTED_GAMES', value: event.target.value });
                      }
                    }
                  }}
                >
                  {games.data.slice(12, games.data.length).map(game => (
                    <option key={game.gameId} value={game.gameName}>
                      {game.gameNameKr || game.gameName}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {state.selectedGames.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6">선택된 게임</Typography>
            <div style={{ padding: 16 }}>
              {state.selectedGames.map(game => (
                <Chip
                  key={`selected_${game}`}
                  label={game}
                  color="primary"
                  variant="outlined"
                  onDelete={(): void => {
                    handleGameClick(game);
                  }}
                  style={{ margin: 4 }}
                />
              ))}
            </div>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default GameSelect;
