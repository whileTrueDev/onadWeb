import React, { useEffect } from 'react';
import { makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import {
  Grid, CircularProgress, Typography, Divider,
  FormControl, InputLabel, Select, Input, Chip
} from '@material-ui/core';
import useGetRequest from '../../../../../utils/hooks/useGetRequest';
import GameCard from './GameCard';
import { ArrayAction } from '../campaignReducer';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    marginTop: '0px',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },

}));


interface GameSelectProps {
  setStepComplete: React.Dispatch<React.SetStateAction<boolean>>;
  checkedGames: string[];
  checkedGamesDispatch: React.Dispatch<ArrayAction>;
  priorityType: string | undefined;
}

interface GameDataInterface {
  count: number;
  content: string;
  gameId: string;
  gameName: string;
  gameNameKr: string;
  boxArt: string;
}

const GameSelect = (props: GameSelectProps): JSX.Element => {
  const {
    setStepComplete, checkedGames, checkedGamesDispatch, priorityType
  } = props;
  const classes = useStyles();
  const theme = useTheme();

  const gamesData = useGetRequest('/creators/analysis/games');

  useEffect(() => {
    if (priorityType !== 'type1') {
      return;
    }
    if (checkedGames.length > 0) {
      setStepComplete(true);
    } else {
      setStepComplete(false);
    }
  }, [checkedGames.length, priorityType, setStepComplete]);

  function handleGameClick(game: string): void {
    if (checkedGames.includes(game)) {
      checkedGamesDispatch({ type: 'delete', value: game });
    } else {
      checkedGamesDispatch({ type: 'push', value: game });
    }
  }

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
                  backgroundColor={checkedGames.includes(game.gameName)
                    ? theme.palette.primary.light : 'inherit'}
                  color={checkedGames.includes(game.gameName)
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
                      if (!checkedGames.includes(event.target.value)) {
                        if (event.target.value) {
                          checkedGamesDispatch({ type: 'push', value: event.target.value });
                        }
                      } else if (event.target.value) {
                        checkedGamesDispatch({ type: 'delete', value: event.target.value });
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

        {checkedGames.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6">선택된 게임</Typography>
            <div style={{ padding: 16 }}>
              {checkedGames.map((game) => (
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
