import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import FormatListNumbered from '@material-ui/icons/FormatListNumbered';
import Table from '../../../atoms/Table/Table2';
import CustomCard from '../../../atoms/CustomCard';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import StyledItemText from '../../../atoms/StyledItemText';
import CircularProgress from '../../../atoms/Progress/CircularProgress';

const useStyles = makeStyles((theme) => ({
  area: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  head: {
    fontWeight: '700',
    color: theme.palette.info.main,
  }
}));

const tableHead = [
  {
    label: '출금신청날짜',
    desc: ''
  },
  {
    label: '출금금액',
    desc: ''
  },
  {
    label: '출금상태',
    desc: ''
  },
];

const Mypage = () => {
  const withDrawalData = useFetchData('/api/dashboard/creator/withdrawal/list');
  const classes = useStyles();

  return (
    <CustomCard iconComponent={<FormatListNumbered />} buttonComponent={<StyledItemText primary="출금 신청 내역" secondary="지금까지의 출금 신청 내역입니다." fontSize="22px" />}>
      {withDrawalData.loading && (<CircularProgress small />)}
      {!withDrawalData.loading && !withDrawalData.error && (
      <Table
        tableHeaderColor="blueGray"
        tableHead={tableHead}
        tableData={withDrawalData.payload.data}
        pagination
      />
      )}
      {!withDrawalData.loading && withDrawalData.error && (
      <div className={classes.area}>
        <Typography variant="h6" className={classes.head}>
          출금 신청 내역이 존재하지 않습니다.
        </Typography>
      </div>
      )}

    </CustomCard>
  );
};

export default Mypage;
