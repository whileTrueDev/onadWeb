
import classnames from 'classnames';
import moment from 'moment';
import React from 'react';
import Markdown from 'react-markdown/with-html';

import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Accordion, AccordionSummary, AccordionDetails, Typography
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { NoticeData } from './NoticeTable';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: 0,
    minWidth: 360,
    minHeight: '70vh',
    backgroundColor: theme.palette.background.paper,
    fontFamily: 'Noto Sans KR',
  },
  MustTopic: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light)
  },
}));

export interface NoticeTableMobileProps {
  data: NoticeData[];
}
export default function NoticeTableMobile({ data }: NoticeTableMobileProps): JSX.Element {
  const classes = useStyles();

  return (
    <div>

      <List component="nav" className={classes.root} aria-label="contacts">
        {data.map((row) => (
          <div key={row.title}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon color="action" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className={classnames({ [classes.MustTopic]: row.topic === '필독' })}
              >
                <div
                  style={{ display: 'flex', flexDirection: 'column', }}
                >
                  <ListItemText secondary={row.topic} />
                  <ListItemText
                    primary={row.title}
                    secondary={<Typography color="textSecondary" variant="body2">{moment(row.regiDate).format('YYYY/MM/DD HH:mm:ss')}</Typography>}
                  />
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ display: 'block' }}>
                  <Markdown
                    source={row.contents}
                    escapeHtml={false}
                    renderers={{ code: ({ value }) => <Markdown source={value} /> }}
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        ))}
      </List>
    </div>
  );
}
