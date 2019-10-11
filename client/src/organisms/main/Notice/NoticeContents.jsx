import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Divider } from '@material-ui/core';
import Markdown from 'react-markdown/with-html';
import Button from '../../../atoms/CustomButtons/Button';
import history from '../../../history';

export default function NoticeContents(props) {
  const { data } = props;

  return (
    <div>
      <Paper>
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
            source={data.contents}
            escapeHtml={false}
            renderers={{ code: ({ value }) => <Markdown source={value} /> }}
          />
        </div>

      </Paper>

      <Button color="white" onClick={() => { history.push('/notice'); }}>
        <Typography style={{ color: '#333' }}>
          목록
        </Typography>
      </Button>
    </div>
  );
}

NoticeContents.propTypes = {
  data: PropTypes.object
};
