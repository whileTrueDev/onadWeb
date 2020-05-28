import React from 'react';
import { Button, Typography } from '@material-ui/core';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import MaterialTable from '../../../../../atoms/Table/MaterialTable';
// hook
import useGetRequest from '../../../../../utils/hooks/useGetRequest';

interface DetailCampaignDialogProps {
  changeHandle: { open: boolean; handleOpen: () => void; handleClose: () => void };
}

interface CPADetail {
  title?: string;
  apImages?: { // 사이즈별 홍보이미지
    icon?: string; icon57?: string; icon114?: string; icon256?: string;
    banner640x100?: string; banner640x960?: string;
    banner960x640?: string; banner640x640?: string;
    banner1024x500?: string;
  };
  campaignIncome: number;
  startDate: string;
  endDate: string;
}

function DetailCampaignDialog({
  changeHandle
}: DetailCampaignDialogProps): JSX.Element {
  const mainIndicatorDetail = useGetRequest<null, CPADetail[]>('/creator/cpa/adpick/indicatorDetail');
  return (
    <Dialog
      open={Boolean(changeHandle.open)}
      title="상세내역 확인"
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
              render: (rowData): string | undefined => (
                rowData.title
              ),
            },
            {
              title: '진행 기간',
              render: (rowData): string | undefined => (
                `${rowData.startDate} ~ ${rowData.endDate}`
              ),
            },
            {
              title: '수익금',
              render: (rowData): number => (
                rowData.campaignIncome
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
