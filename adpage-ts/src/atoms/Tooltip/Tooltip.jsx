import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MuiTooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
}))(MuiTooltip);

/**
 * @description tooltip 컴포넌트.
 * - textArray property로 문자열을 원소로하는 배열을 넘겨주면, 줄단위로 나누어 디스플레이한다.
 * - 이외 material-ui/core/Tooltip 컴포넌트와 공유하는 prop이 같음.
 * - 참조: https://material-ui.com/api/tooltip/
 */
function Tooltip(props) {
  const {
    children, textArray, title, ...rest
  } = props;
  return (
    <StyledTooltip
      title={textArray ? (
        <React.Fragment>
          {textArray.map(text => (
            <Typography key={text} color="inherit" variant="body2">{text}</Typography>
          ))}
        </React.Fragment>
      ) : title}

      {...rest}
    >
      {children}
    </StyledTooltip>
  );
}

Tooltip.propTypes = {
  title: PropTypes.string,
  textArray: PropTypes.arrayOf(PropTypes.string)
};

Tooltip.defaultProps = {
  title: '',
  textArray: ['', '']
};

export default Tooltip;
