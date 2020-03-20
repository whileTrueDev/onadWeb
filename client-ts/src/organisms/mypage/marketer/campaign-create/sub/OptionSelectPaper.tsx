import React from 'react';
import { useTheme, makeStyles, Theme } from '@material-ui/core/styles';
import { Paper, ButtonBase } from '@material-ui/core';
import StyledSelectText from '../../../../../atoms/StyledSelectText';
import GreenCheckbox from '../../../../../atoms/GreenCheckBox';

const useStyles = makeStyles((theme: Theme) => ({
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

interface OptionSelectPaperProps {
  primaryText: string;
  secondaryText: string;
  handleSelect?: () => void;
  checked: boolean;
  disabled?: boolean;
  children?: JSX.Element;
  innerPaperChildren?: JSX.Element;
}


export default function OptionSelectPaper(props: OptionSelectPaperProps): JSX.Element {
  const {
    checked, handleSelect, primaryText,
    secondaryText, disabled, children,
    innerPaperChildren
  } = props;
  const classes = useStyles();
  const theme = useTheme();

  function getBackgroudColor(): string {
    if (checked) {
      return theme.palette.primary.light;
    } if (!checked && disabled) {
      return theme.palette.grey[300];
    }
    return 'inherit';
  }

  return (
    <div className={classes.root}>
      {/* 해당 버튼클릭을 사용하기 위해서는 buttonref를 사용해야한다. */}
      <ButtonBase
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
