import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Tooltip } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import MaterialTable from '../../../atoms/Table/MaterialTable';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import useTestData from '../../../utils/lib/hooks/useTestData';

const BANNER_MAX_WIDTH = 320;
const BANNER_MAX_HEIGHT = 200;

export default function BannerTable(props) {
  const { handleDeleteOpen } = props;
  // const fetchData = useFetchData('/api/dashboard/marketer/banner/all');
  const fetchData = useTestData('/marketer/banner/list');

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
    { title: '배너 등록 일자', field: 'regiDate', },
  ];

  return (
    <div>
      {fetchData.loading && (<MaterialTable columns={columns} isLoading />)}
      {!fetchData.loading && fetchData.error && (<span>Error</span>)}
      {!fetchData.loading && fetchData.payload && (
        <MaterialTable
          title={null}
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
              actions: '삭제'
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
