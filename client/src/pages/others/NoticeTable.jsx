import React from 'react';
import { Typography, Link } from '@material-ui/core';

import FiberNew from '@material-ui/icons/FiberNew';
import MaterialTable from '../../atoms/Table/MaterialTable';

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
              { rowData.regiDate.getDate() > new Date().getDate() && (
                <FiberNew color="secondary" />
              )}
            </Typography>
          )
        },
        { title: '작성일', field: 'regiDate', type: 'datetime' },
      ]}
      data={[
        {
          code: '15', topic: '시스템 점검', title: '[긴급 점검] 1994년 09월 15일 긴급 시스템 점검 안내', regiDate: new Date()
        },
        {
          code: '14', topic: '시스템 점검', title: '[긴급 점검] 1994년 09월 15일 긴급 시스템 점검 안내 ', regiDate: new Date()
        },
        {
          code: '13', topic: '시스템 점검', title: '[긴급 점검] 1994년 09월 15일 긴급 시스템 점검 안내', regiDate: new Date()
        },
        {
          code: '12', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date()
        },
        {
          code: '11', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date()
        },
        {
          code: '10', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date()
        },
        {
          code: '9', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date()
        },
        {
          code: '8', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date()
        },
        {
          code: '7', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date()
        },
        {
          code: '6', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date()
        },
        {
          code: '5', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date()
        },
        {
          code: '4', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date()
        },
        {
          code: '3', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date()
        },
        {
          code: '2', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date()
        },
        {
          code: '1', topic: '결제/계산서', title: '[계산서] 2019년 9월 세금계산서 발행 및 수정발행 안내', regiDate: new Date()
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
