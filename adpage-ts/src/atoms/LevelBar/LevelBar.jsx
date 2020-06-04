import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

export default function LevelBar(props) {
  const { level, exp } = props;
  return (
    <div>
      <Typography variant="h6">{`Lv. ${level}`}</Typography>
      <LinearProgress
        value={exp} // 경험치 100 분위수
        variant="determinate"
      />
    </div>
  );
}

LevelBar.propTypes = {
  level: PropTypes.number,
  exp: PropTypes.number
};

LevelBar.defaultProps = {
  level: 1,
  exp: 0
};
