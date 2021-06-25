import classnames from 'classnames';
import { Paper, Typography, Divider, makeStyles, Chip } from '@material-ui/core';
import Markdown from 'react-markdown/with-html';
import { NoticeData } from './NoticeTable';

const useStyles = makeStyles(theme => ({
  markdown: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.body1.fontWeight,
  },
  container: { padding: theme.spacing(4) },
  chip: { margin: theme.spacing(0, 0.5, 0, 0) },
}));

interface NoticeContentsProps {
  selectedNotice: NoticeData;
}
export default function NoticeContents({ selectedNotice }: NoticeContentsProps): JSX.Element {
  const classes = useStyles();
  return (
    <Paper>
      <div className={classes.container}>
        <Chip color="primary" label={selectedNotice.topic} className={classes.chip} />
        <Chip color="default" label={selectedNotice.target} className={classes.chip} />
        <Typography variant="h6">{selectedNotice.title}</Typography>
        <Typography variant="body2">
          {new Date(selectedNotice.regiDate).toLocaleString()}
        </Typography>
      </div>

      <Divider />

      <div className={classes.container}>
        <Markdown
          className={classnames(classes.markdown, 'react-markdown')}
          source={selectedNotice.contents}
          escapeHtml={false}
        />
      </div>
    </Paper>
  );
}
