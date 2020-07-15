import React, { useEffect } from 'react';
import { makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import {
  Grid, CircularProgress, Typography, Divider,
  FormControl, InputLabel, Select, Input, Chip
} from '@material-ui/core';
import GameCard from './GameSelectCard';
import { CampaignCreateInterface, CampaignCreateAction } from '../reducers/campaignCreate.reducer';

import useGetRequest from '../../../../../utils/hooks/useGetRequest';

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

interface GameDataInterface {
  count: number;
  content: string;
  gameId: string;
  gameName: string;
  gameNameKr: string;
  boxArt: string;
}
interface GameSelectProps {
  state: CampaignCreateInterface;
  dispatch: React.Dispatch<CampaignCreateAction>;
  handleComplete: () => void;
  handleIncomplete: () => void;
}

const GameSelect = (props: GameSelectProps): JSX.Element => {
  const {
    state, dispatch, handleComplete, handleIncomplete
  } = props;
  const classes = useStyles();
  const theme = useTheme();

  // **********************************************************
  // 게임데이터 로딩 및 클릭 핸들러
  const gamesData = useGetRequest('/creators/analysis/games');
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
        <Typography variant="h6">광고를 송출하려는 게임을 선택해주세요.</Typography>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        {gamesData.loading && (
          <div style={{ padding: 72, textAlign: 'center' }}>
            <CircularProgress size={100} disableShrink />
          </div>
        )}
        {!gamesData.loading && gamesData.data && (

          <Grid container spacing={2} style={{ flexWrap: 'wrap' }}>
            {gamesData.data.slice(0, 12).map((game: GameDataInterface) => (
              <Grid key={game.gameId} item xs={4} md={3} xl={2}>
                <GameCard
                  gameName={game.gameName}
                  gameNameKr={game.gameNameKr}
                  count={game.count}
                  boxArt={game.boxArt}
                  handleClick={(): void => { handleGameClick(game.gameName); }}
                  backgroundColor={state.selectedGames.includes(game.gameName)
                    ? theme.palette.primary.light : 'inherit'}
                  color={state.selectedGames.includes(game.gameName)
                    ? theme.palette.common.white : 'inherit'}
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
                    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
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
                  {gamesData.data.slice(12, gamesData.data.length).map(
                    (game: GameDataInterface) => (
                      <option
                        key={game.gameId}
                        value={game.gameName}
                      >
                        {game.gameNameKr || game.gameName}

                      </option>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {state.selectedGames.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6">선택된 게임</Typography>
            <div style={{ padding: 16 }}>
              {state.selectedGames.map((game) => (
                <Chip
                  key={`selected_${game}`}
                  label={game}
                  color="primary"
                  variant="outlined"
                  onDelete={(): void => { handleGameClick(game); }}
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
