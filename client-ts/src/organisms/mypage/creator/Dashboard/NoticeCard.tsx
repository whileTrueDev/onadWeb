import moment from 'moment';
import classnames from 'classnames';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import history from '../../../../history';
import { usePatchRequest } from '../../../../utils/hooks';
import { NoticeData } from '../../shared/notice/NoticeTable';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(1),
    height: 250,
    overflowY: 'auto',
  },
  bold: { fontWeight: 'bold' },
  section: { marginTop: theme.spacing(2) },
  noticeItem: {
    margin: `${theme.spacing(1)}px 0px`,
    display: 'flex',
    justifyContent: 'space-between',
  },
  noticeDate: { marginLeft: theme.spacing(1), minWidth: 60, cursor: 'default' },
  ellipsis: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  right: { textAlign: 'right' },
  link: {
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' },
  },
}));
export interface NoticeCardProps {
  noticeData: NoticeData[];
}
export default function NoticeCard({ noticeData }: NoticeCardProps): JSX.Element {
  const classes = useStyles();
  const noticeReadFlagPatch = usePatchRequest('/notice/read-flag');

  return (
    <Paper className={classes.container}>
      <Typography className={classes.bold}>최근 공지사항</Typography>

      <div className={classes.section}>
        {noticeData
          .sort((x, y) => new Date(y.regiDate).getTime() - new Date(x.regiDate).getTime())
          .slice(0, 5)
          .map(noti => (
            <div key={noti.code} className={classes.noticeItem}>
              <Typography
                onClick={(): void => {
                  noticeReadFlagPatch.doPatchRequest();
                  history.push('/mypage/creator/notice', { selectedNotice: noti.code });
                }}
                className={classnames(classes.link, classes.ellipsis)}
              >
                {noti.title}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                align="right"
                className={classes.noticeDate}
              >
                {moment(noti.regiDate).fromNow()}
              </Typography>
            </div>
          ))}
      </div>

      <div className={classes.right}>
        <Typography
          className={classes.link}
          variant="caption"
          color="textSecondary"
          onClick={(): void => {
            history.push('/mypage/creator/notice');
          }}
        >
          자세히 보기
        </Typography>
      </div>
    </Paper>
  );
}
