import React from 'react';
import { Button, Typography } from '@material-ui/core';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import MaterialTable from '../../../../../atoms/Table/MaterialTable';
// hook
import useGetRequest from '../../../../../utils/hooks/useGetRequest';

interface DetailCampaignDialogProps {
  changeHandle: { open: boolean; handleOpen: () => void; handleClose: () => void };
}

function DetailCampaignDialog({
  changeHandle
}: DetailCampaignDialogProps): JSX.Element {
  const mainIndicatorDetail = useGetRequest<null>('/creator/cpa/adpick/indicatorDetail');
  return (
    <Dialog
      open={Boolean(changeHandle.open)}
      title={(
        <div>
          <Typography variant="h6">
            상세내역 확인
          </Typography>
        </div>
      )}
      onClose={changeHandle.handleClose}
      fullWidth
      maxWidth="md"
      buttons={(
        <div>
          <Button onClick={(): void => {
            changeHandle.handleClose();
          }}
          >
            확인
          </Button>
        </div>
      )}
    >
      {!mainIndicatorDetail.loading && mainIndicatorDetail.data ? (
        <MaterialTable
          title="참여형 광고 캠페인의 기간별 수익금 현황입니다"
          columns={[
            {
              title: '캠페인',
              render: (rowData): JSX.Element => (
                <p>{rowData.title}</p>
              ),
            },
            {
              title: '진행 기간',
              render: (rowData): JSX.Element => (
                <p>
                  {rowData.startDate}
                  ~
                  {rowData.endDate}
                </p>
              ),
            },
            {
              title: '수익금',
              render: (rowData) => (
                <p>{rowData.campaignIncome}</p>
              ),
            },
          ]}
          data={!mainIndicatorDetail.loading ? mainIndicatorDetail.data : []}
          options={{
            search: true,
            pageSize: 5,
            pageSizeOptions: [5, 10, 15],
            headerStyle: { backgroundColor: '#f5f5f5', color: '#555555' },
            searchFieldAlignment: 'right',
          }}
        />
      )
        : (
          <h1> 잠시만 기다려 주세요</h1>
        )}
    </Dialog>
  );
}

export default DetailCampaignDialog;
