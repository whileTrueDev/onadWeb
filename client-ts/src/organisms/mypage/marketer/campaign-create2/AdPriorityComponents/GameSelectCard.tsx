import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, ButtonBase, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  image: {
    position: 'relative',
    display: 'block',
    overflow: 'hidden',
  },
}));

interface GameCardProps {
  count: number;
  gameName: string;
  gameNameKr: string;
  boxArt: string;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  backgroundColor: string;
  color: string;
}

export default function GameCard(props: GameCardProps): JSX.Element {
  const { boxArt, gameName, gameNameKr, count, handleClick, backgroundColor, color } = props;
  const classes = useStyles();
  return (
    <Paper>
      <ButtonBase className={classes.image} onClick={handleClick}>
        <img draggable={false} width="100%" key={boxArt} src={boxArt} alt={gameName} />
        <Grid
          container
          justify="space-evenly"
          direction="column"
          alignItems="center"
          style={{
            height: 150,
            backgroundColor,
            color,
          }}
        >
          <Grid>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
              {gameNameKr || gameName}
            </Typography>
          </Grid>
          <Grid item style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
            <Typography variant="body2">{gameNameKr ? gameName : ''}</Typography>
            <Typography variant="caption">
              {count}
              명이 주로 이 방송을 진행
            </Typography>
          </Grid>
        </Grid>
      </ButtonBase>
    </Paper>
  );
}
