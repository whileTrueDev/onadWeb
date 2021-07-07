import { makeStyles, Paper, Typography } from '@material-ui/core';
import classnames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import history from '../../../../history';
import { useUpdateNoticeReadFlagMutation } from '../../../../utils/hooks/mutation/useUpdateNoticeReadFlagMutation';
import { useNoticeList } from '../../../../utils/hooks/query/useNoticeList';

dayjs.extend(relativeTime);

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

export default function NoticeCard(): JSX.Element {
  const classes = useStyles();
  const noticeList = useNoticeList();
  const noticeReadFlagMutation = useUpdateNoticeReadFlagMutation();

  return (
    <Paper className={classes.container}>
      <Typography className={classes.bold}>최근 공지사항</Typography>

      <div className={classes.section}>
        {noticeList.isLoading && <CenterLoading />}
        {!noticeList.isLoading &&
          noticeList.data &&
          noticeList.data.slice(0, 5).map(noti => (
            <div key={noti.code} className={classes.noticeItem}>
              <Typography
                onClick={async () => {
                  await noticeReadFlagMutation.mutateAsync();
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
                {dayjs(noti.regiDate).fromNow()}
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
