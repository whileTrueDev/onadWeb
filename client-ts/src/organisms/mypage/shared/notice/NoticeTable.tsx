/* eslint-disable react/display-name */
import * as React from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';
import Typography from '@material-ui/core/Typography';
import FiberNew from '@material-ui/icons/FiberNew';
import { lighten, makeStyles, Paper } from '@material-ui/core';
import CustomDataGrid from '../../../../atoms/Table/CustomDataGrid';

const useStyles = makeStyles(theme => ({
  new: { color: theme.palette.primary.main },
  title: {
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' },
  },
  container: {
    width: '100%',
    height: 600,
    marginTop: theme.spacing(2),
  },
  datagrid: { width: '100%', height: '100%' },
  important: {
    backgroundColor: lighten(theme.palette.error.main, 0.5),
    color: theme.palette.getContrastText(lighten(theme.palette.error.main, 0.5)),
    fontWeight: theme.typography.fontWeightBold,
    padding: theme.spacing(0.5, 0),
  },
}));

function dateDiff(date1: Date, date2: Date): number {
  return Math.ceil((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
}

export interface NoticeTableProps {
  data: NoticeData[];
  loading?: boolean;
  onNoticeClick: (notice: NoticeData) => void;
}
export interface NoticeData {
  id: string;
  code: string;
  topic: string;
  headerName: string;
  regiDate: string;
  title: string;
  contents?: string;
  target: string;
}

export default function NoticeTable({
  data,
  loading,
  onNoticeClick,
}: NoticeTableProps): JSX.Element {
  const classes = useStyles();

  function isImportantNotice(topic: string): boolean {
    return topic === '필독';
  }
  return (
    <Paper>
      <div className={classes.container}>
        <CustomDataGrid
          className={classes.datagrid}
          loading={loading}
          rows={data}
          scrollbarSize={10}
          columns={[
            {
              width: 100,
              headerName: '번호',
              disableColumnMenu: true,
              field: 'code',
              renderCell: (_data): React.ReactElement => (
                <Typography variant="body2" noWrap>
                  {_data.row.code}
                </Typography>
              ),
            },
            {
              width: 110,
              headerName: '구분',
              field: 'target',
              renderCell: (_data): React.ReactElement => (
                <Typography variant="body2" noWrap>
                  {_data.row.target}
                </Typography>
              ),
            },
            {
              width: 150,
              headerName: '카테고리',
              field: 'topic',
              renderCell: (_data): React.ReactElement => (
                <Typography variant="body2" noWrap>
                  {_data.row.topic}
                </Typography>
              ),
            },
            {
              flex: 1,
              width: 250,
              headerName: '글제목',
              field: 'title',
              renderCell: (_data): React.ReactElement => (
                <Typography
                  className={classnames({
                    [classes.title]: true,
                    [classes.important]: isImportantNotice(_data.row.topic),
                  })}
                  onClick={(): void => onNoticeClick(_data.row as NoticeData)}
                  variant="body2"
                  noWrap
                >
                  {_data.row.title}
                  {dateDiff(new Date(), new Date(_data.row.regiDate)) < 8 && (
                    <FiberNew className={classes.new} />
                  )}
                </Typography>
              ),
            },
            {
              width: 200,
              headerName: '작성일',
              field: 'regiDate',
              renderCell: (_data): React.ReactElement => (
                <Typography variant="body2" noWrap>
                  {dayjs(_data.row.regiDate).format('YYYY/MM/DD HH:mm:ss')}
                </Typography>
              ),
            },
          ]}
        />
      </div>
    </Paper>
  );
}
