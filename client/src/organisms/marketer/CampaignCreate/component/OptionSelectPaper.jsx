import React from 'react';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { Paper, ButtonBase } from '@material-ui/core';
import StyledSelectText from '../../../../atoms/StyledSelectText';
import GreenCheckbox from '../../../../atoms/GreenCheckBox';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(3),
  },
  choiceWrapper: {
    width: '100%',
  },
  choice: {
    width: '100%',
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
}));

export default function OptionSelectPaper(props) {
  const {
    name, checked, handleSelect,
    primaryText, secondaryText, disabled, children,
    innerPaperChildren
  } = props;
  const classes = useStyles();
  const theme = useTheme();

  function getBackgroudColor() {
    if (checked) {
      return theme.palette.primary.light;
    } if (!checked && disabled) {
      return theme.palette.grey[300];
    }
    return 'inherit';
  }

  return (
    <div className={classes.root}>
      <ButtonBase
        name={name}
        checked={checked}
        className={classes.choiceWrapper}
        onClick={handleSelect}
        disabled={disabled}
      >
        <Paper
          className={classes.choice}
          style={{
            backgroundColor: getBackgroudColor(),
            color: checked ? theme.palette.common.white : 'inherit'
          }}
          elevation={checked ? 1 : 4}
        >
          <div style={{ alignItems: 'center', flexDirection: 'column' }}>
            <GreenCheckbox
              name={name}
              checked={checked}
              onChange={handleSelect}
            />
            <StyledSelectText
              primary={primaryText}
              secondary={secondaryText}
              color={checked ? theme.palette.common.white : 'inherit'}
            />
            {innerPaperChildren || null}
          </div>
        </Paper>
      </ButtonBase>

      <div style={{ width: '100%' }}>
        {children}
      </div>
    </div>
  );
}

OptionSelectPaper.propTypes = {
  name: PropTypes.string.isRequired,
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string.isRequired,
  handleSelect: PropTypes.func,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  innerPaperChildren: PropTypes.node,
};

OptionSelectPaper.defaultProps = {
  checked: false,
  handleSelect() {},
  disabled: false,
  innerPaperChildren: null
};
