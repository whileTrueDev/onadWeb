import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper, ButtonBase, Grid, Typography
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  image: {
    position: 'relative',
    display: 'block',
    overflow: 'hidden',
  },
}));

export default function GameCard(props) {
  const {
    boxArt, gameName, gameNameKr, count, handleClick, backgroundColor, color
  } = props;
  const classes = useStyles();
  return (
    <Paper>
      <ButtonBase
        className={classes.image}
        focusvisibleclassname={classes.focusVisible}
        onClick={handleClick}
      >
        <img
          width="100%"
          key={boxArt}
          src={boxArt}
          alt={gameName}
        />
        <Grid
          container
          justify="space-evenly"
          direction="column"
          alignItems="center"
          style={{
            height: 150,
            backgroundColor,
            color
          }}
        >
          <Grid>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
              {gameNameKr || gameName}

            </Typography>
          </Grid>
          <Grid item style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
            <Typography variant="body2">
              {gameNameKr ? gameName : ''}
            </Typography>
            <Typography variant="caption">
              {count}
                명이 주로 이 게임을 방송중
            </Typography>
          </Grid>
        </Grid>
      </ButtonBase>
    </Paper>
  );
}

GameCard.propTypes = {
  boxArt: PropTypes.string.isRequired,
  gameName: PropTypes.string.isRequired,
  gameNameKr: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  handleClick: PropTypes.func,
  backgroundColor: PropTypes.string,
  color: PropTypes.string
};

GameCard.defaultProps = {
  handleClick() {},
  backgroundColor: 'inherit',
  color: 'inherit',
};
