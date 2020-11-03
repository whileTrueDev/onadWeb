import React from 'react';
import {
  Paper, Typography, Divider, makeStyles
} from '@material-ui/core';
import Markdown from 'react-markdown/with-html';
import Button from '../../../atoms/CustomButtons/Button';
import history from '../../../history';

const useStyles = makeStyles((theme) => ({
  markdown: { fontSize: theme.typography.body1.fontSize, fontWeight: 400 }
}));

interface NoticeData {
  code: string;
  topic: string;
  title: string;
  contents: string;
  regiDate: string;
}
interface Props {
  data: NoticeData;
}
export default function NoticeContents({ data }: Props): JSX.Element {
  const classes = useStyles();
  return (
    <div>
      <Paper style={{ fontFamily: 'Roboto', }}>
        <div style={{ padding: 28 }}>
          <Typography variant="h4">
            {data.title}
          </Typography>

          <div style={{ display: 'flex', marginTop: 10, justifyContent: 'space-bwtween' }}>
            <Typography variant="subtitle1">
              {`${data.topic},`}
              &emsp;
            </Typography>
            <Typography variant="subtitle1">
              {new Date(data.regiDate).toLocaleString()}
            </Typography>
          </div>
        </div>

        <Divider />


        <div style={{ padding: 28 }}>
          <Markdown
            className={classes.markdown}
            source={data.contents}
            escapeHtml={false}
            renderers={{ code: ({ value }) => <Markdown source={value} /> }}
          />
        </div>

      </Paper>

      <Button onClick={() => { history.push('/notice'); }}>
        <Typography style={{ color: '#333' }}>
          목록
        </Typography>
      </Button>
    </div>
  );
}
