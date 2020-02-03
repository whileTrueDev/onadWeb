import React from 'react';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
  FormControl
} from '@material-ui/core';

import StyledItemText from '../../../atoms/StyledItemText';
import Button from '../../../atoms/CustomButtons/Button';
import CampaignNaming from './CampaignNaming';
import CampaignBannerReg from './CampaignBannerReg';
import LandingUrlInput from './LandingUrlInput';
import CampaignBudgetSet from './CampaignBudgetSet';
import BudgetInput from './BudgetInput';
import CampaignTimeSet from './CampaignTimeSet';
import DatePicker from './DatePicker';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const CssFormControl = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#00acc1',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#00acc1',
    },
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#00acc1',
      },
    },
  },
})(FormControl);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const CampaignCreateTable = (props) => {
  const classes = useStyles();
  const {
    bannerList, handleBannerId, handleDetailOpen, detailOpen, step1State,
    state, dispatch, handleDateOpen, dateOpen, handleSetLandingUrlState, datePickerOpen, handleDatePickerOpen
  } = props;
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableBody>
          <StyledTableRow>
            <StyledTableCell>
              캠페인 이름 입력
            </StyledTableCell>
            <StyledTableCell>
              <CampaignNaming
                dispatch={dispatch}
              />
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>
              배너 선택
            </StyledTableCell>
            <StyledTableCell>
              <CampaignBannerReg
                bannerList={bannerList}
                handleBannerId={handleBannerId}
                dispatch={dispatch}
              />
              <StyledItemText>새로운 배너를 등록하고 싶으신가요?</StyledItemText>
              <Button
                onClick={() => { window.open(`${window.location.protocol}//${window.location.host}/dashboard/marketer/banner`); }}
              >
                나의 인벤토리
              </Button>
            </StyledTableCell>
          </StyledTableRow>
          {step1State.option !== 'option0' ? (
            <StyledTableRow>
              <TableCell>
              랜딩페이지 URL
              </TableCell>
              <StyledTableCell>
                <LandingUrlInput
                  handleSetLandingUrlState={handleSetLandingUrlState}
                />
              </StyledTableCell>
            </StyledTableRow>
          ) : (<div />) }
          <StyledTableRow>
            <TableCell>
              예산설정
            </TableCell>
            <StyledTableCell>
              <CampaignBudgetSet
                handleDetailOpen={handleDetailOpen}
                detailOpen={detailOpen}
              />
              {detailOpen
                ? (
                  <BudgetInput
                    state={state}
                    dispatch={dispatch}
                  />
                ) : (<div />)
              }
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>
              기간설정
            </TableCell>
            <StyledTableCell>
              <CampaignTimeSet
                handleDateOpen={handleDateOpen}
                dateOpen={dateOpen}
              />
              {dateOpen ? (<DatePicker />) : (<div />)}
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CampaignCreateTable;