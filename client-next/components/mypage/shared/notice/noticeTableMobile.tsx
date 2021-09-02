import classnames from 'classnames';
import dayjs from 'dayjs';
import Markdown from 'react-markdown/with-html';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { NoticeData } from '../../../../utils/hooks/query/useNoticeList';

const useStyles = makeStyles(theme => ({
  accordion: { marginTop: theme.spacing(1) },
  root: {
    width: '100%',
    padding: 0,
    minWidth: 280,
    minHeight: '70vh',
    backgroundColor: theme.palette.background.paper,
    fontFamily: 'Noto Sans KR',
  },
  title: { display: 'flex', flexDirection: 'column' },
  important: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light),
  },
  detail: {
    backgroundColor: theme.palette.background.default,
  },
  markdown: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.body1.fontWeight,
  },
}));

export interface NoticeTableMobileProps {
  data: NoticeData[];
}
export default function NoticeTableMobile({ data }: NoticeTableMobileProps): JSX.Element {
  const classes = useStyles();

  return (
    <List component="nav" className={classes.root} aria-label="contacts">
      {data.map(row => (
        <div key={row.title}>
          <Accordion
            variant="outlined"
            TransitionProps={{ unmountOnExit: true }}
            className={classes.accordion}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color="action" />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className={classnames({ [classes.important]: row.topic === '필독' })}
            >
              <div className={classes.title}>
                <Typography variant="body2" color="textSecondary">
                  {row.topic}
                </Typography>
                <ListItemText
                  primary={row.title}
                  secondary={
                    <Typography color="textSecondary" variant="body2">
                      {dayjs(row.regiDate).format('YYYY/MM/DD HH:mm:ss')}
                    </Typography>
                  }
                />
              </div>
            </AccordionSummary>
            <AccordionDetails className={classes.detail}>
              <div>
                <Markdown
                  source={row.contents}
                  escapeHtml={false}
                  className={classnames(classes.markdown, 'react-markdown')}
                />
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </List>
  );
}
