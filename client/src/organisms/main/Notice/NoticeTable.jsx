import React from 'react';
import Typography from '@material-ui/core/Typography';
import FiberNew from '@material-ui/icons/FiberNew';

import MaterialTable from '../../../atoms/Table/MaterialTable';
import history from '../../../history';

function dateDiff(date1, date2) {
  return Math.ceil((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
}

export default function NoticeTable(props) {
  const { data } = props;
  return (
    <MaterialTable
      title="공지 사항"
      columns={[
        { title: '글번호', field: 'code', render: (rowData) => (<Typography>{rowData.code}</Typography>) },
        { title: '구분', field: 'topic', render: (rowData) => (<Typography>{rowData.topic}</Typography>) },
        {
          title: '글제목',
          field: 'title',
          render: (rowData) => (
            <Typography className="title">
              {rowData.title}
              { dateDiff(new Date(), new Date(rowData.regiDate)) < 8 && (
                <FiberNew style={{ color: '#ff9800' }} />
              )}
            </Typography>
          )
        },
        {
          title: '작성일',
          field: 'regiDate',
          render: (rowData) => (
            <Typography>{new Date(rowData.regiDate).toLocaleString()}</Typography>
          )
        },
      ]}
      data={data}
      onRowClick={(e, rowData) => { history.push(`/notice/${rowData.code}`); }}
      options={{
        search: true,
        add: false,
        pageSize: 15,
        pageSizeOptions: [5, 10, 15],
        rowStyle: {
          height: 65,
          '&:hover': {
            backgroundColor: '#rgb(211, 211, 211)',
          },
        },
        headerStyle: { backgroundColor: '#f5f5f5', color: '#555555' },
        searchFieldAlignment: 'right'
      }}
    />
  );
}
