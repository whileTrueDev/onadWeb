import React from 'react';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface ExpansionPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}
export default function ExpansionPanel({
  title,
  children,
  className,
  ...rest
}: ExpansionPanelProps): JSX.Element {
  return (
    <div className={className}>
      <MuiExpansionPanel {...rest}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <Typography variant="body1" gutterBottom>
            {title}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
      </MuiExpansionPanel>
    </div>
  );
}
