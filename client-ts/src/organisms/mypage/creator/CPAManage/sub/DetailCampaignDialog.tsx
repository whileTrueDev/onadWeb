import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import MaterialTable from '../../../../../atoms/Table/MaterialTable';
// hook
import useGetRequest from '../../../../../utils/hooks/useGetRequest';
// css

const useStyle = makeStyles(() => ({
  title: {
    textAlign: 'center',
    fontFamily: 'Noto Sans KR'
  },
  date: {
    textAlign: 'center',
    fontFamily: 'Noto Sans KR'
  },
  income: {
    textAlign: 'center',
  },
  titleContent: {
    fontFamily: 'Noto Sans KR',
    margin: '10px 0 10px 0'
  }
}));

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
  const classes = useStyle();
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
              title: '진행 캠페인',
              render: (rowData): JSX.Element => (
                <div className={classes.title}>
                  <img src={rowData.apImages?.icon} alt="" height="100" width="100" />
                  <h4 className={classes.titleContent}>{rowData.title}</h4>
                </div>
              ),
            },
            {
              title: '진행 기간',
              render: (rowData): JSX.Element => (
                <p className={classes.date}>
                  {rowData.startDate}
                  {' '}
                  ~
                  {' '}
                  {rowData.endDate}
                </p>
              ),
            },
            {
              title: '수익금',
              render: (rowData): JSX.Element => (
                <h4 className={classes.income}>
                  {rowData.campaignIncome}
                  원
                </h4>
              ),
            },
          ]}
          data={!mainIndicatorDetail.loading ? mainIndicatorDetail.data : []}
          options={{
            search: true,
            pageSize: 5,
            pageSizeOptions: [5, 10, 15],
            headerStyle: { backgroundColor: '#f5f5f5', color: '#555555', textAlign: 'center' },
            searchFieldAlignment: 'right',
          }}
        />
      )
        : (
          <h1> 잠시만 기다려 주세요</h1>
          // 로딩 컴포넌트
        )}
    </Dialog>
  );
}

export default DetailCampaignDialog;
