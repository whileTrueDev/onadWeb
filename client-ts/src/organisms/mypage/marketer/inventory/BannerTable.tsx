import React from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import MaterialTable from '../../../../atoms/Table/MaterialTable';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import { bannerDataInterface } from './interface';

const BANNER_MAX_WIDTH = 320;
const BANNER_MAX_HEIGHT = 200;

interface propInterface {
  handleDeleteOpen: (v?: boolean | undefined) => void;
  setBanner: React.Dispatch<React.SetStateAction<bannerDataInterface | null>>;
}

export default function BannerTable(props: propInterface) {
  const { handleDeleteOpen, setBanner } = props;
  const fetchData = useGetRequest<null, bannerDataInterface[] | null>('/marketer/banner/list');

  const columns = [
    {
      title: '배너 이미지',
      render: (rowData: bannerDataInterface) => (
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
      render: (rowData: bannerDataInterface) => {
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
      {fetchData.loading && (<MaterialTable columns={columns} data={[]} isLoading style={{ boxShadow: 'none' }} />)}
      {!fetchData.loading && fetchData.error && (<span>Error</span>)}
      {!fetchData.loading && fetchData.data && (
        <MaterialTable
          style={{ boxShadow: 'none' }}
          title=''
          columns={columns}
          data={fetchData.data}
          actions={[
            {
              icon: () => (<Delete />),
              tooltip: '배너삭제',
              onClick: (event: React.MouseEvent<HTMLButtonElement>, data: bannerDataInterface | bannerDataInterface[]) => {
                if (Array.isArray(data)) {
                  setBanner(data[0]);
                } else {
                  setBanner(data);
                }
                handleDeleteOpen();
              }
            }
          ]}
          options={{
            actionsColumnIndex: -1,
            search: false
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

