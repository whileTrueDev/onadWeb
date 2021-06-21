/* eslint-disable react/display-name */
import React from 'react';
// atoms
import { Typography, Button } from '@material-ui/core';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import MaterialTable from '../../../../atoms/Table/MaterialTable';
import Dialog from '../../../../atoms/Dialog/Dialog';
import CPACampaignIcon from './sub/CPACampaignIcon';
// types
import {
  CampaignResult,
  AdPickIncome,
  AdpickCampaignTypeEnum,
  AdpickCampaignStateEnum,
} from './AdpickTypes';

// For column width - type error from Materiap-table
declare module 'material-table' {
  export interface Column<RowData extends object> {
    width?: string;
  }
}
interface CPAIncomeTableProps {
  open: boolean;
  handleClose: () => void;
  campaigns: CampaignResult[];
  campaignIncomes?: AdPickIncome[] | null;
}
export default function CPAIncomeTable({
  open,
  handleClose,
  campaigns,
  campaignIncomes,
}: CPAIncomeTableProps): JSX.Element {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="참여형 광고 수익 내역"
      fullWidth
      maxWidth="lg"
      buttons={<Button onClick={handleClose}>확인</Button>}
    >
      <GridContainer>
        <GridItem xs>
          <MaterialTable
            title="수익 내역"
            data={campaignIncomes || []}
            columns={[
              {
                width: '100px',
                render: (rowData): JSX.Element => (
                  <CPACampaignIcon src={rowData.apImages?.icon} size="small" />
                ),
              },
              { title: '캠페인', field: 'apAppTitle' },
              {
                title: '상태',
                field: 'campaignState',
                render: (rowData): JSX.Element => (
                  <>
                    {!(campaigns.findIndex(cam => rowData.apOffer === cam.apOffer) > -1) ? (
                      <Typography variant="body2">중지(종료)</Typography>
                    ) : (
                      <>
                        {rowData.campaignState === AdpickCampaignStateEnum.ACTIVE && (
                          <Typography variant="body2">등록됨</Typography>
                        )}
                        {rowData.campaignState === AdpickCampaignStateEnum.INACTIVE && (
                          <Typography variant="body2">제외됨</Typography>
                        )}
                      </>
                    )}
                  </>
                ),
              },
              {
                title: '기간(전환기준)',
                render: (rowData): JSX.Element => (
                  <Typography variant="body2">{`${rowData.startDate} ~ ${rowData.endDate}`}</Typography>
                ),
              },
              {
                title: '유형',
                field: 'apType',
                lookup: {
                  [AdpickCampaignTypeEnum.INSTALL]: '설치형',
                  [AdpickCampaignTypeEnum.EVENT]: '이벤트형',
                  [AdpickCampaignTypeEnum.RESERVATION]: '사전예약',
                  [AdpickCampaignTypeEnum.SIGNUP]: '회원가입',
                },
              },
              { title: '전환', type: 'numeric', field: 'conversionCount' },
              { title: '수익', type: 'numeric', field: 'campaignIncome' },
            ]}
            options={{
              search: true,
              pageSize: 5,
              pageSizeOptions: [5, 10, 15],
            }}
          />
        </GridItem>
      </GridContainer>
    </Dialog>
  );
}
