import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Divider } from '@material-ui/core';
import StyledItemText from '../../../../../atoms/StyledItemText';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: '0px',
    alignItem: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
    '& .MuiGrid-container': {
      flexWrap: 'nowrap',
    },
  },
  item: {
    marginBottom: '15px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
      padding: 0,
    },
  },
}));

interface CampaignCreateStepLayoutProps {
  primaryText: string;
  secondaryText: string;
  children?: React.ReactNode;
}

export default function CampaignCreateStepLayout(
  props: CampaignCreateStepLayoutProps,
): JSX.Element {
  const classes = useStyles();
  const { children, primaryText, secondaryText } = props;
  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      {/* campaign create paper - 제목 */}
      <Grid item className={classes.item} xs={12}>
        <StyledItemText primary={primaryText} secondary={secondaryText} />
        <Divider component="hr" style={{ height: '2px' }} />
      </Grid>

      {/* campaign create paper - 컨텐츠 */}
      <Grid item className={classes.item} xs={12}>
        {children}
      </Grid>
    </Grid>
  );
}
