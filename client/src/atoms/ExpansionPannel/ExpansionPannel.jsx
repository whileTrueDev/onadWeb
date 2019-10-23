import React from 'react';
import PropTypes from 'prop-types';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function ExpansionPanel(props) {
  const {
    title,
    children,
    className,
    ...rest
  } = props;

  return (
    <div
      className={className}
    >
      <MuiExpansionPanel {...rest}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <Typography variant="body1" gutterBottom>{title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {children}
        </ExpansionPanelDetails>
      </MuiExpansionPanel>
    </div>
  );
}

ExpansionPanel.propTypes = {
  title: PropTypes.string,
};

ExpansionPanel.defaultProps = {
  title: '',
};
