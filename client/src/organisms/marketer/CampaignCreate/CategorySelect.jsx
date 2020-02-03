import React, { useEffect } from 'react';
import shortid from 'shortid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Grid, Divider, Paper, CircularProgress, Typography,
  ButtonBase, Select, FormControl, Input,
  InputLabel, Chip
} from '@material-ui/core';
import StyledItemText from '../../../atoms/StyledItemText';
import useFetchData from '../../../utils/lib/hooks/useFetchData';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: '0px',
    alignItem: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
    marginBottom: theme.spacing(2),
  },
  choice: {
    width: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  button: {
    width: '100%',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  image: {
    position: 'relative',
    display: 'block',
    overflow: 'hidden',
  },

}));

const CategorySelect = (props) => {
  const {
    setStepComplete, checkedGames, checkedGamesDispatch
  } = props;
  const classes = useStyles();
  const theme = useTheme();

  useEffect(() => {
    if (checkedGames.length >= 1) {
      setStepComplete(true);
    } else {
      setStepComplete(false);
    }
  }, [checkedGames.length, setStepComplete]);

  const gamesData = useFetchData('/api/dashboard/marketer/creatordetail/games/top');

  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <Grid container direction="column" spacing={2}>
          <Grid item className={classes.item}>
            <StyledItemText primary="게임을 선택하세요" secondary="광고를 송출하고자 하는 게임을 선택하세요." />
            <Divider component="hr" style={{ height: '2px' }} />
          </Grid>

          <Grid item>
            {gamesData.loaidng && (
            <div style={{ padding: 72, textAlign: 'center' }}>
              <CircularProgress size={100} disableShrink />
            </div>
            )}
            {!gamesData.loaidng && gamesData.payload && (
            <Grid container direction="row" spacing={2}>

                {gamesData.payload.slice(0, 12).map(game => (
                  <Grid item xs={12} sm={4} lg={3} xl={2} key={shortid.generate()}>
                    <Paper>
                      <ButtonBase
                        key={game.gameId}
                        className={classes.image}
                        focusvisibleclassname={classes.focusVisible}
                        onClick={() => {
                          if (checkedGames.includes(game.gameName)) {
                            checkedGamesDispatch({ type: 'delete', value: game.gameName });
                          } else {
                            checkedGamesDispatch({ type: 'push', value: game.gameName });
                          }
                        }}
                      >
                        <img
                          width="100%"
                          heigth="285"
                          key={game.boxArt}
                          src={game.boxArt}
                          alt={game.gameName}
                        />
                        <Grid
                          container
                          justify="space-evenly"
                          direction="column"
                          alignItems="center"
                          style={{
                            height: 150,
                            backgroundColor: checkedGames.includes(game.gameName)
                              ? theme.palette.primary.light : 'inherit',
                            color: checkedGames.includes(game.gameName)
                              ? theme.palette.common.white : 'inherit',
                          }}
                        >
                          <Grid>
                            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                              {game.gameNameKr ? game.gameNameKr : game.gameName}

                            </Typography>
                          </Grid>
                          <Grid item style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            <Typography variant="body2">
                              {game.gameNameKr ? game.gameName : ''}
                            </Typography>
                            <Typography variant="caption">
                              {game.count}
                              명이 주로 이 게임을 방송중
                            </Typography>
                          </Grid>
                        </Grid>
                      </ButtonBase>
                    </Paper>
                  </Grid>
                ))}

              <Grid item>
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
            <Grid item>
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
      </Grid>
    </Grid>
  );
};

export default CategorySelect;
