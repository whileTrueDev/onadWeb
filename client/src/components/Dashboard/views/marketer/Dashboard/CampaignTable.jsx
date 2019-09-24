import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import Table from '../../../components/Table/Table';
import Button from '../../../components/CustomButtons/Button';

const useStyles = makeStyles(() => ({
  flex: {
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  clickable: {
    color: '#00acc1',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}));

export default function CampaignTable() {
  const classes = useStyles();
  const [campaign, setCampaign] = React.useState(false);
  function handleCreateCampaign() {
    console.log('캠페인 생성 클릭');
  }
  return (
    <div>
      <Button color="info" onClick={handleCreateCampaign}>
        <Add />
                새 캠페인 등록하기
      </Button>
      {campaign ? (
        <Table
          tableHeaderColor="info"
          tableHead={['캠페인명', '일예산', '금일 사용금액', '총 사용 금액', '클릭수', '노출수', '등록된 배너']}
          tableData={[
            ['-', '-', '-', '-', '-', '-']
          ]}
        />

      ) : (
        <div style={{ marginBottom: 55, marginTop: 55 }}>
          <div className={classes.flex}>
            <Typography>등록된 캠페인이 없습니다.</Typography>
          </div>
          <div className={classes.flex}>
            <Typography
              className={classes.clickable}
              onClick={handleCreateCampaign}
            >
              새 캠페인 등록하기
            </Typography>
            <Typography>&emsp;를 클릭하여 새로운 캠페인을 시작하세요.</Typography>
          </div>
        </div>
      )}
    </div>
  );
}
