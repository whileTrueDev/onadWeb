import React from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import MaterialTable from '../../../../../atoms/Table/MaterialTable';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import { BannerDataInterface } from '../interface';
import VideoBanner from '../../../../../atoms/Banner/VideoBanner';
import isVideo from '../../../../../utils/isVideo';
import { useDialog } from '../../../../../utils/hooks';
import DeleteDialog from './DeleteDialog';

const BANNER_MAX_WIDTH = 320;
const BANNER_MAX_HEIGHT = 200;

interface BannerInventoryProps {
  bannerData: UseGetRequestObject<BannerDataInterface[] | null>;
  handleItemSelect: (item: string) => void;
}

export default function BannerInventory(props: BannerInventoryProps): JSX.Element {
  const {
    bannerData, handleItemSelect
  } = props;

  const [selectedBanner, setBanner] = React.useState<BannerDataInterface | null>(null);

  const deleteDialog = useDialog();

  const columns = [
    {
      title: '배너 이미지',
      render: (rowData: BannerDataInterface): JSX.Element => (
        <>
          { isVideo(rowData.bannerSrc) ? (
            <VideoBanner
              src={rowData.bannerSrc}
              style={{ maxHeight: BANNER_MAX_HEIGHT, maxWidth: BANNER_MAX_WIDTH }}
            />
          ) : (
            <img
              src={rowData.bannerSrc}
              alt={rowData.bannerId}
              style={{ maxHeight: BANNER_MAX_HEIGHT, maxWidth: BANNER_MAX_WIDTH }}
            />
          )}
        </>
      )
    },
    {
      title: '심의 결과',
      field: 'confirmState',
      render: (rowData: BannerDataInterface): React.ReactNode => {
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
      {bannerData.loading && (<MaterialTable columns={columns} data={[]} isLoading style={{ boxShadow: 'none' }} />)}
      {!bannerData.loading && bannerData.error && (<span>Error</span>)}
      {!bannerData.loading && bannerData.data && (
        <MaterialTable
          style={{ boxShadow: 'none' }}
          title=""
          columns={columns}
          data={bannerData.data}
          actions={[
            {
              icon: (): JSX.Element => (<Delete />),
              tooltip: '배너삭제',
              onClick: (event: React.MouseEvent<HTMLButtonElement>,
                data: BannerDataInterface | BannerDataInterface[]): void => {
                if (Array.isArray(data)) {
                  handleItemSelect(data[0].bannerId);
                  setBanner(data[0]);
                } else {
                  handleItemSelect(data.bannerId);
                  setBanner(data);
                }
                deleteDialog.handleOpen();
              }
            }
          ]}
          options={{
            actionsColumnIndex: -1,
            search: false,
            headerStyle: { zIndex: 0 }
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

      {/* banner  delete dialog */}
      {deleteDialog.open && selectedBanner && (
        <DeleteDialog
          open={deleteDialog.open}
          selectedBanner={selectedBanner}
          handleClose={deleteDialog.handleClose}
          recallRequest={bannerData.doGetRequest}

        />
      )}

    </div>
  );
}
