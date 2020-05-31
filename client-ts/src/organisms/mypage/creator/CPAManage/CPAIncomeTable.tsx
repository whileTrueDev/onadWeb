import React from 'react';
// atoms
import { Typography } from '@material-ui/core';
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import MaterialTable from '../../../../atoms/Table/MaterialTable';
import CPACampaignIcon from './sub/CPACampaignIcon';
// types
import {
  CampaignResult,
  AdPickIncome,
  AdpickCampaignTypeEnum,
  AdpickCampaignStateEnum
} from './AdpickTypes';

interface CPAIncomeTableProps {
  campaigns: CampaignResult[];
  campaignIncomes: AdPickIncome[];
}
export default function CPAIncomeTable({
  campaigns,
  campaignIncomes
}: CPAIncomeTableProps): JSX.Element {
  return (
    <GridContainer>
      <GridItem xs>
        <MaterialTable
          title="수익 내역"
          data={campaignIncomes}
          columns={[
            {
              width: '100px',
              render: (rowData): JSX.Element => (
                <CPACampaignIcon src={rowData.apImages?.icon} size="small" />
              )
            },
            { title: '캠페인', field: 'apAppTitle' },
            {
              title: '상태',
              field: 'campaignState',
              render: (rowData): JSX.Element => (
                <>
                  {!(campaigns.findIndex((cam) => rowData.apOffer === cam.apOffer) > -1) && (
                    <Typography>중지(종료)</Typography>
                  )}
                  {rowData.campaignState === AdpickCampaignStateEnum.ACTIVE && (
                    <Typography>등록됨</Typography>
                  )}
                  {rowData.campaignState === AdpickCampaignStateEnum.INACTIVE && (
                    <Typography>제외됨</Typography>
                  )}
                </>
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
              }
            },
            { title: '전환', type: 'numeric', field: 'conversionCount' },
            { title: '수익', type: 'numeric', field: 'campaignIncome' },
          ]}
          options={{
            search: false, pageSize: 5, pageSizeOptions: [5, 10, 15],
          }}
        />

      </GridItem>
    </GridContainer>
  );
}
