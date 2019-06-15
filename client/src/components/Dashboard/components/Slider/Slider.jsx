import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/lab/Slider';
import { fade } from '@material-ui/core/styles/colorManipulator';

// const primary = ['#9c27b0', '#ab47bc', '#8e24aa', '#af2cc5'];
// const warning = ['#ff9800', '#ffa726', '#fb8c00', '#ffa21a'];
const danger = ['#f44336', '#ef5350', '#e53935', '#f55a4e'];
// const info = ['#00acc1', '#26c6da', '#00acc1', '#00d3ee'];
// const rose = ['#e91e63', '#ec407a', '#d81b60', '#eb3573'];
const gray = ['#999', '#777', '#3C4858', '#AAAAAA', '#D2D2D2', '#DDD'];
const success = ['#4caf50', '#66bb6a', '#43a047', '#5cb860'];
const white = '#FFF';

const StyledSlider = withStyles({
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: white,
    border: `2px solid ${success[2]}`,
    '&$focused, &:hover': {
      boxShadow: `0px 0px 0px ${8}px ${fade(success[2], 0.16)}`,
    },
    '&$activated': {
      boxShadow: `0px 0px 0px ${8 * 1.5}px ${fade(success[2], 0.16)}`,
    },
    '&$jumped': {
      boxShadow: `0px 0px 0px ${8 * 1.5}px ${fade(success[2], 0.16)}`,
    },
  },
  track: {
    backgroundColor: success[2],
    height: 8,
  },
  trackAfter: {
    backgroundColor: gray[3],
  },
  focused: {},
  activated: {},
  jumped: {},
})(Slider);

const ErrorStyledSlider = withStyles({
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: white,
    border: `2px solid ${danger[1]}`,
    '&$focused, &:hover': {
      boxShadow: `0px 0px 0px ${8}px ${fade(danger[1], 0.16)}`,
    },
    '&$activated': {
      boxShadow: `0px 0px 0px ${8 * 1.5}px ${fade(danger[1], 0.16)}`,
    },
    '&$jumped': {
      boxShadow: `0px 0px 0px ${8 * 1.5}px ${fade(danger[1], 0.16)}`,
    },
  },
  track: {
    backgroundColor: danger[1],
    height: 8,
  },
  trackAfter: {
    backgroundColor: gray[3],
  },
  focused: {},
  activated: {},
  jumped: {},
})(Slider);

export default function CustomSlider(props) {
  const {
    className,
    error,
    value,
    onChange,
    min,
    max,
    step,
    ...rest
  } = props;

  return (
    <div>
      {error ? (
        <ErrorStyledSlider
          value={value}
          aria-labelledby="label"
          className={className}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          {...rest}
        />
      )
        : (
          <StyledSlider
            value={value}
            aria-labelledby="label"
            className={className}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            {...rest}
          />
        )
  }
    </div>
  );
}

CustomSlider.propTypes = {
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  error: PropTypes.bool,
};

CustomSlider.defaultProps = {
  className: '',
  value: 0,
  onChange: null,
  min: 0,
  max: 100,
  step: 1,
  error: false,
};
