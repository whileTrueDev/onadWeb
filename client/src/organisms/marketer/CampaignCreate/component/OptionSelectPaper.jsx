import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper, ButtonBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import StyledSelectText from '../../../../atoms/StyledSelectText';
import GreenCheckbox from '../../../../atoms/GreenCheckBox';

const useStyles = makeStyles(theme => ({
  choiceWrapper: {
    width: '100%',
    marginBottom: theme.spacing(3),
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
    name, checked, handleOptionSelect,
    primaryText, secondaryText, fontColor, ...rest
  } = props;
  const classes = useStyles();


  return (
    <ButtonBase
      name={name}
      checked={checked}
      className={classes.choiceWrapper}
      onClick={handleOptionSelect}
    >
      <Paper className={classes.choice} {...rest}>
        <Grid container alignItems="center" direction="column">
          <GreenCheckbox
            name={name}
            checked={checked}
            onChange={handleOptionSelect}
          />
          <StyledSelectText primary={primaryText} secondary={secondaryText} color={fontColor} />
        </Grid>
      </Paper>
    </ButtonBase>
  );
}

OptionSelectPaper.propTypes = {
  name: PropTypes.string.isRequired,
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string.isRequired,
  handleOptionSelect: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  fontColor: PropTypes.string
};

OptionSelectPaper.defaultProps = {
  checked: false,
  fontColor: null,
};
