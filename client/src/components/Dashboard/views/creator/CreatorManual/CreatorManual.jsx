import React from 'react';
// core ../../../components
import { makeStyles, withStyles } from '@material-ui/core/styles';
// material-ui

import Select from './Select';
import SetBanner from './SetBanner';
import ContractManual from './ContractManual';
import ProgramSetting from './ProgramSetting';
import IncomeManual from './IncomeManual';
import WithdrawalManual from './WithdrawalManual';

//

const ButtonStyle = makeStyles({
  root: {
    background: 'white',
    borderRadius: 3,
    border: 0,
    color: 'black',
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    width: '300px',
    height: '100px',
  },
  label: {
    textTransform: 'capitalize',
    flexDirection: 'column',
  },
});

// const classes = ButtonStyle();
const CreatorManual = props => (
  <div>
    <Select />
    <ContractManual />
    <SetBanner />
    <ProgramSetting />
    <IncomeManual />
    <WithdrawalManual />
  </div>
);
export default withStyles(ButtonStyle)(CreatorManual);
