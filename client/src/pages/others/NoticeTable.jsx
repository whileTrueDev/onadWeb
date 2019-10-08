import React from 'react';
import { Typography, Link } from '@material-ui/core';

import FiberNew from '@material-ui/icons/FiberNew';
import MaterialTable from '../../atoms/Table/MaterialTable';

function dateDiff(date1, date2) {
  return Math.ceil((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
}

export default function NoticeTable() {
  return (
    <MaterialTable
      title="공지 사항"
      columns={[
        { title: '번호', field: 'code', render: rowData => (<Typography>{rowData.code}</Typography>) },
        { title: '구분', field: 'topic', render: rowData => (<Typography>{rowData.topic}</Typography>) },
        {
          title: '제목',
          field: 'title',
          render: rowData => (
            <Typography>
              <Link
                style={{ color: '#333' }}
                href={`${window.location.pathname}?code=${rowData.code}`}
              >
                {rowData.title}
              </Link>
              { dateDiff(new Date(), rowData.regiDate) < 8 && (
                <FiberNew style={{ color: '#ff9800' }} />
              )}
            </Typography>
          )
        },
        { title: '작성일', field: 'regiDate', type: 'datetime' },
      ]}
      data={[
        {
          code: '15', topic: '시스템 점검', title: '[긴급 점검] 1994년 09월 15일 긴급 시스템 점검 안내', regiDate: new Date(2019, 9, 7)
        },
        {
          code: '14', topic: '시스템 점검', title: '[긴급 점검] 1994년 09월 15일 긴급 시스템 점검 안내 ', regiDate: new Date(2019, 9, 6)
        },
        {
          code: '13', topic: '시스템 점검', title: '[긴급 점검] 1994년 09월 15일 긴급 시스템 점검 안내', regiDate: new Date(2019, 9, 5)
        },
        {
          code: '12', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 4)
        },
        {
          code: '11', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 3)
        },
        {
          code: '10', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 2)
        },
        {
          code: '9', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 2)
        },
        {
          code: '8', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
        },
        {
          code: '7', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
        },
        {
          code: '6', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
        },
        {
          code: '5', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
        },
        {
          code: '4', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
        },
        {
          code: '3', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
        },
        {
          code: '2', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
        },
        {
          code: '1', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date(2019, 9, 1)
        },
      ]}
      options={{
        search: true,
        add: false,
        pageSize: 15,
        pageSizeOptions: [5, 10, 15],
        rowStyle: { height: 65 },
        headerStyle: { backgroundColor: '#f5f5f5', color: '#555555' },
        searchFieldAlignment: 'right'
      }}
    />
  );
}
