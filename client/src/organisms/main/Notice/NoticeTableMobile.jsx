
import React from 'react';
import Markdown from 'react-markdown/with-html';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: 0,
    minWidth: 360,
    minHeight: '70vh',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function NoticeTableMobile(props) {
  const { data } = props;
  const classes = useStyles();

  return (
    <div>
      <div style={{ padding: 18 }}>
        <Typography variant="h5">공지사항</Typography>
      </div>

      <List component="nav" className={classes.root} aria-label="contacts">
        {data.map(row => (
          <div>
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <ListItemText secondary={row.topic} />
                  <ListItemText primary={row.title} secondary={row.regiDate} />
                </div>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div style={{ display: 'block' }}>
                  <Markdown
                    source={row.contents}
                    escapeHtml={false}
                    renderers={{ code: ({ value }) => <Markdown source={value} /> }}
                  />
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        ))}
      </List>
    </div>
  );
}
