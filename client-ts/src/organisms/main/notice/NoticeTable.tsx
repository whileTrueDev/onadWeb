import React from 'react';
import Typography from '@material-ui/core/Typography';
import FiberNew from '@material-ui/icons/FiberNew';
import MaterialTable from '../../../atoms/Table/MaterialTable';
import history from '../../../history';

function dateDiff(date1: Date, date2: Date): number {
  return Math.ceil((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
}

interface Props {
  data: NoticeData[];
}

interface NoticeData {
  code: string;
  topic: string;
  title: string;
  regiDate: string;
  contents?: string;
}

export default function NoticeTable({ data }: Props): JSX.Element {
  return (
    <MaterialTable
      title="공지사항"
      columns={[
        { title: '글번호', field: 'code', render: (rowData): JSX.Element => (<Typography>{rowData.code}</Typography>) },
        { title: '구분', field: 'topic', render: (rowData): JSX.Element => (<Typography>{rowData.topic}</Typography>) },
        {
          title: '글제목',
          field: 'title',
          render: (rowData): JSX.Element => (
            <Typography className="title">
              {rowData.title}
              {dateDiff(new Date(), new Date(rowData.regiDate)) < 8 && (
                <FiberNew style={{ color: '#ff9800' }} />
              )}
            </Typography>
          )
        },
        {
          title: '작성일',
          field: 'regiDate',
          render: (rowData): JSX.Element => (
            <Typography>{new Date(rowData.regiDate).toLocaleString()}</Typography>
          )
        },
      ]}
      data={data}
      onRowClick={(e, rowData: any) => { history.push(`/notice/${rowData.code}`); }}
      options={{
        search: true,
        // add: false,
        pageSize: 15,
        pageSizeOptions: [5, 10, 15],
        rowStyle: {
          height: 65
        },
        headerStyle: { backgroundColor: '#f5f5f5', color: '#555555' },
        searchFieldAlignment: 'right'
      }}
    />
  );
}
