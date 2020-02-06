import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Grid, CircularProgress, Typography, Divider,
  FormControl, InputLabel, Select, Input, Chip
} from '@material-ui/core';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import GameCard from './component/GameCard';


const useStyles = makeStyles(theme => ({
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

const GameSelect = (props) => {
  const {
    setStepComplete, checkedGames, checkedGamesDispatch
  } = props;
  const classes = useStyles();
  const theme = useTheme();

  const gamesData = useFetchData('/api/dashboard/marketer/creatordetail/games/top');

  useEffect(() => {
    if (checkedGames.length > 0) {
      setStepComplete(true);
    } else {
      setStepComplete(false);
    }
  }, [checkedGames.length, setStepComplete]);

  function handleGameClick(game) {
    if (checkedGames.includes(game.gameName)) {
      checkedGamesDispatch({ type: 'delete', value: game.gameName });
    } else {
      checkedGamesDispatch({ type: 'push', value: game.gameName });
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
        {!gamesData.loading && gamesData.payload && (

        <Grid container spacing={2} style={{ flexWrap: 'wrap' }}>
          {gamesData.payload.slice(0, 12).map(game => (
            <Grid item xs={4} md={3} xl={2}>
              <GameCard
                gameName={game.gameName}
                gameNameKr={game.gameNameKr}
                count={game.count}
                boxArt={game.boxArt}
                handleClick={() => { handleGameClick(game); }}
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
                onChange={(e) => {
                  if (!checkedGames.includes(e.target.value)) {
                    if (e.target.value) {
                      checkedGamesDispatch({ type: 'push', value: e.target.value });
                    }
                  }
                }}
              >
                {gamesData.payload.slice(12, gamesData.payload.length).map(game => (
                  <option value={game.gameName}>{game.gameNameKr}</option>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        )}

        {checkedGames.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="h6">선택된 게임</Typography>
          <div style={{ padding: 16 }}>
            {checkedGames.map(game => (
              <Chip
                key={game.gameId}
                label={game}
                color="primary"
                variant="outlined"
                style={{ margin: 4 }}
                onDelete={() => {
                  checkedGamesDispatch({ type: 'delete', value: game });
                }}
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
