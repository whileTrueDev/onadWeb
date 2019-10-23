import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Tooltip } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import MaterialTable from '../../../atoms/Table/MaterialTable';
import useFetchData from '../../../utils/lib/hooks/useFetchData';

const BANNER_MAX_WIDTH = 320;
const BANNER_MAX_HEIGHT = 200;

export default function BannerTable(props) {
  const { handleDeleteOpen } = props;
  const fetchData = useFetchData('/api/dashboard/marketer/banner/all');

  const columns = [
    {
      title: '배너 이미지',
      render: rowData => (
        <img
          src={rowData.bannerSrc}
          alt={rowData.bannerId}
          style={{ maxHeight: BANNER_MAX_HEIGHT, maxWidth: BANNER_MAX_WIDTH }}
        />
      )
    },
    { title: '회사 소개', field: 'companyDescription', },
    { title: '배너 소개', field: 'bannerDescription', },
    {
      title: '배너 링크',
      render: rowData => (
        <Typography
          style={{ textDecoration: 'underline', color: '#00acc1', cursor: 'pointer' }}
          onClick={() => { window.open(rowData.landingUrl); }}
          component="a"
        >
          {rowData.landingUrl}
        </Typography>
      ),

    },
    {
      title: '심의 결과',
      field: 'confirmState',
      render: (rowData) => {
        switch (rowData.confirmState) {
          case 0: return '승인대기⏰';
          case 1: return '승인됨👌';
          case 2: return (
            <Tooltip
              title={<Typography variant="body2">{`사유: ${rowData.bannerDenialReason}`}</Typography>}
            >
              <Typography style={{ color: 'red' }}>거절됨</Typography>
            </Tooltip>
          );
          default: throw new Error('you need confirmState for table');
        }
      },

    },
    { title: '최근 업데이트', field: 'date', },
    { title: '배너 생성 일자', field: 'regiDate', },
  ];

  return (
    <div>
      {fetchData.loading && (<MaterialTable columns={columns} isLoading />)}
      {!fetchData.loading && fetchData.error && (<span>Error</span>)}
      {!fetchData.loading && fetchData.payload && (
        <MaterialTable
          title="나의 배너 리스트"
          columns={columns}
          data={fetchData.payload}
          actions={[
            {
              icon: () => (<Delete />),
              tooltip: '배너삭제',
              onClick: (e, rowData) => { handleDeleteOpen(rowData); }
            }
          ]}
          options={{
            actionsColumnIndex: -1
          }}
          localization={{
            body: {
              emptyDataSourceMessage: '등록된 배너가 없습니다.'
            },
            header: {
              actions: '기타'
            }
          }}
        />
      )}

    </div>
  );
}

BannerTable.propTypes = {
  handleDeleteOpen: PropTypes.func.isRequired
};
