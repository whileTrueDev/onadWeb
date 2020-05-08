import React from 'react';
import Typography from '@material-ui/core/Typography';
import FiberNew from '@material-ui/icons/FiberNew';
import MaterialTable from '../../../atoms/Table/MaterialTable';
import history from '../../../history';

// For column width - type error from Materiap-table
declare module 'material-table' {
  export interface Column<RowData extends object> {
    width?: string;
  }
}
function dateDiff(date1: Date, date2: Date): number {
  return Math.ceil((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
}

interface Props {
  data: NoticeData[];
  loading?: boolean | null;
}

interface NoticeData {
  code: string;
  topic: string;
  title: string;
  regiDate: string;
  contents?: string;
}

export default function NoticeTable({ data, loading }: Props): JSX.Element {
  return (
    <MaterialTable
      title="공지사항"
      columns={[
        {
          width: '120px',
          title: '글번호',
          field: 'code',
          render: (rowData): JSX.Element => (<Typography>{rowData.code}</Typography>)
        },
        {
          title: '구분',
          field: 'topic',
          render: (rowData): JSX.Element => (<Typography>{rowData.topic}</Typography>),
        },
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
          width: '180px',
          title: '작성일',
          field: 'regiDate',
          render: (rowData): JSX.Element => (
            <Typography>{new Date(rowData.regiDate).toLocaleString()}</Typography>
          )
        },
      ]}
      data={data}
      isLoading={loading || false}
      onRowClick={(e, rowData: any) => { history.push(`/notice/${rowData.code}`); }}
      options={{
        search: true,
        // add: false,
        pageSize: 15,
        pageSizeOptions: [5, 10, 15],
        rowStyle: (rowData: NoticeData): React.CSSProperties => (
          rowData.topic === '필독'
            ? { height: 65, backgroundColor: '#F5A9A9', color: '#000' }
            : { height: 65, backgroundColor: '#fff', color: '#000' }
        ),
        searchFieldAlignment: 'right',
        headerStyle: { backgroundColor: '#f5f5f5', color: '#555555' }
      }}
    />
  );
}
