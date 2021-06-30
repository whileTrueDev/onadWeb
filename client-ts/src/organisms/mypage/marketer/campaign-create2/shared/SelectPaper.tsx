import * as React from 'react';
import { useTheme, makeStyles, Theme } from '@material-ui/core/styles';
import { Typography, Paper, ButtonBase } from '@material-ui/core';
import GreenCheckbox from '../../../../../atoms/Checkbox/GreenCheckBox';

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

interface SelectPaperProps {
  primaryText: string;
  secondaryText: string;
  handleSelect?: () => void;
  checked: boolean;
  disabled?: boolean;
  children?: JSX.Element;
  innerPaperChildren?: React.ReactNode;
}

export default function SelectPaper(props: SelectPaperProps): JSX.Element {
  const {
    checked,
    handleSelect,
    primaryText,
    secondaryText,
    disabled,
    children,
    innerPaperChildren,
  } = props;
  const classes = useStyles();
  const theme = useTheme();

  function getBackgroudColor(): string {
    if (checked) {
      return theme.palette.primary.light;
    }
    if (!checked && disabled) {
      return theme.palette.action.disabledBackground;
    }
    return 'inherit';
  }

  return (
    <div className={classes.root}>
      <ButtonBase className={classes.choiceWrapper} onClick={handleSelect} disabled={disabled}>
        <Paper
          className={classes.choice}
          style={{
            backgroundColor: getBackgroudColor(),
            color: checked ? theme.palette.common.white : 'inherit',
          }}
          elevation={checked ? 1 : 4}
        >
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <GreenCheckbox checked={checked} onChange={handleSelect} />
            <Typography variant="h5" style={{ fontWeight: 700, paddingBottom: 16 }}>
              {primaryText}
            </Typography>
            {secondaryText.split('\n').map(t => (
              <Typography key={t} variant="body1">
                {t}
              </Typography>
            ))}

            {innerPaperChildren || null}
          </div>
        </Paper>
      </ButtonBase>

      <div style={{ width: '100%' }}>{children}</div>
    </div>
  );
}
