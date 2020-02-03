import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Tooltip } from '@material-ui/core';
import { Delete, OpenInNew, Star } from '@material-ui/icons';
import MaterialTable from '../../../atoms/Table/MaterialTable';
import useFetchData from '../../../utils/lib/hooks/useFetchData';

export default function UrlTable(props) {
  const { handleDeleteOpen } = props;
  const fetchData = useFetchData('/api/dashboard/marketer/inventory/landingurl/all');

  const columns = [
    { title: '링크세트' },
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
    {
      title: '링크이름 및 주소',
      render: rowData => (
        <div>
          {rowData.links.links.map(link => (
            <div key={link.linkTo}>
              <span>
                  이름:
                {' <'}
                {link.linkName ? link.linkName : '이름없음' }
                {'> '}
              </span>
              <span>
                {' '}
                링크 주소:
                {' '}
              </span>
              <a
                href={link.linkTo}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(link.linkTo);
                }}
              >
                {link.linkTo}
              </a>
              <OpenInNew onClick={() => { window.open(link.linkTo); }} />
              {link.primary && (
                <Tooltip title={(
                  <Typography>
                  primary링크로, 배너이미지 클릭시 곧바로 연결되는 링크입니다.
                  primary링크가 아닌 링크들은 배너가 아닌 링크이름을 클릭했을 때 이동합니다.
                  </Typography>
                )}
                >
                  <Star color="secondary" />
                </Tooltip>
              )}
            </div>
          ))}
        </div>
      ),
    },
    { title: '링크 등록 일자', field: 'regiDate' },
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
              tooltip: '링크 삭제',
              onClick: (e, rowData) => { handleDeleteOpen(rowData); }
            }
          ]}
          options={{
            actionsColumnIndex: -1
          }}
          localization={{
            body: {
              emptyDataSourceMessage: '등록된 랜딩페이지 URL이 없습니다.'
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

UrlTable.propTypes = {
  handleDeleteOpen: PropTypes.func.isRequired
};
