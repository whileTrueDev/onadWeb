import moment from 'moment';
import classnames from 'classnames';
import React from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import history from '../../../../history';

const useStyles = makeStyles((theme) => ({
  ellipsis: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  link: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    }
  }
}));

export interface NoticeData {
  code: string;
  topic: string;
  title: string;
  contents: string;
  regiDate: string;
}
export interface NoticeCardProps {
  noticeData: NoticeData[];
}
export default function NoticeCard({
  noticeData,
}: NoticeCardProps): JSX.Element {
  const classes = useStyles();
  return (
    <Paper style={{
      padding: 32, marginTop: 8, height: 250, overflowY: 'auto'
    }}
    >
      <Typography style={{ fontWeight: 'bold' }}>
        최근 공지사항
      </Typography>

      <div style={{ marginTop: 16 }}>
        {noticeData
          .sort((x, y) => new Date(y.regiDate).getTime() - new Date(x.regiDate).getTime())
          .slice(0, 5)
          .map((noti) => (
            <div key={noti.code} style={{ margin: '8px 0px', display: 'flex', justifyContent: 'space-between' }}>
              <Typography
                onClick={(): void => {
                  history.push(`/notice/${noti.code}`);
                }}
                className={classnames(classes.link, classes.ellipsis)}
              >
                {noti.title}
              </Typography>
              <Typography variant="caption" color="textSecondary" align="right" style={{ marginLeft: 8, minWidth: 60, cursor: 'default' }}>
                {moment(noti.regiDate).fromNow()}
              </Typography>
            </div>
          ))}
      </div>

      <div style={{ textAlign: 'right' }}>
        <Typography
          variant="caption"
          color="textSecondary"
          className={classes.link}
          onClick={(): void => {
            history.push('/notice');
          }}
        >
          자세히 보기
        </Typography>
      </div>
    </Paper>
  );
}
