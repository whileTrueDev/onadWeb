import React from 'react';
import {
  Typography
} from '@material-ui/core';

// atoms
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import MaterialTable from '../../../../atoms/Table/MaterialTable';

// types
import {
  AdPickIncome, AdpickCampaignTypeEnum
} from './AdpickTypes';
// hooks

interface CPAIncomeTableProps {
  campaignIncomes: AdPickIncome[];
}
export default function CPAIncomeTable({
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
              width: '40%',
              title: '캠페인',
              render: (rowData): JSX.Element => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={rowData.apImages?.icon}
                    alt=""
                    height="50"
                    width="50"
                    style={{ borderRadius: 10, marginRight: 8 }}
                  />
                  <Typography>
                    {rowData.apAppTitle}
                  </Typography>
                </div>
              )
            },
            {
              // width: '120px',
              title: '유형',
              render: (rowData): JSX.Element => (
                <Typography>
                  {(AdpickCampaignTypeEnum.INSTALL === rowData.apType) && '설치형'}
                  {(AdpickCampaignTypeEnum.EVENT === rowData.apType) && '이벤트형'}
                  {AdpickCampaignTypeEnum.RESERVATION === rowData.apType && '사전예약'}
                  {AdpickCampaignTypeEnum.SIGNUP === rowData.apType && '회원가입'}
                </Typography>
              )
            },
            {
              title: '전환',
              field: 'conversionCount'
            },
            {
              width: '20%',
              title: '수익',
              render: (rowData): JSX.Element => (
                <Typography>
                  {rowData.campaignIncome}
                </Typography>
              )
            },
          ]}
          options={{
            search: false, pageSize: 5, pageSizeOptions: [5, 10, 15],
          }}
        />

      </GridItem>
    </GridContainer>
  );
}
