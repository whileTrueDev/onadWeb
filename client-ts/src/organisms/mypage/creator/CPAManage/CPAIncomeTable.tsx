import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// atoms
import GridContainer from '../../../../atoms/Grid/GridContainer';
import GridItem from '../../../../atoms/Grid/GridItem';
import MaterialTable from '../../../../atoms/Table/MaterialTable';

// types
import {
  AdPickIncome, AdpickCampaignTypeEnum
} from './AdpickTypes';


const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex', alignItems: 'center'
  },
  appLogo: {
    width: 50, height: 50, borderRadius: 10, marginRight: theme.spacing(1)
  }
}));

interface CPAIncomeTableProps {
  campaignIncomes: AdPickIncome[];
}
export default function CPAIncomeTable({
  campaignIncomes
}: CPAIncomeTableProps): JSX.Element {
  const classes = useStyles();

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
                <div className={classes.flex}>
                  <img
                    className={classes.appLogo}
                    src={rowData.apImages?.icon}
                    alt=""
                  />
                </div>
              )
            },
            { title: '캠페인', field: 'apAppTitle' },
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
