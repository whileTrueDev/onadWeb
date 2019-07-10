import React, { useState } from 'react';
// core ../../../components
import { makeStyles, withStyles } from '@material-ui/core/styles';
// material-ui

import Select from './Select';
import SetBanner from './SetBanner';
import ContractManual from './ContractManual';
import ProgramSetting from './ProgramSetting';
import IncomeManual from './IncomeManual';
import WithdrawalManual from './WithdrawalManual';

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
const CreatorManual = (props) => {

  const [manual, setManual] = useState(0)

  const handleButton = num => {
    setManual(num);
  };

  const handleButtonClose = () => {
    setManual(false);
  };

return(
  <div>
    <Select 
    handleButton = {handleButton} 
    handleButtonClose = {handleButtonClose}
    />

       { (() => {
          if (manual === 0) return (<div></div>);
          if (manual === 1) return (<ContractManual />);
          if (manual === 2) return (<SetBanner />);
          if (manual === 3) return (<ProgramSetting />);
          if (manual === 4) return (<IncomeManual />);
          if (manual === 5) return (<WithdrawalManual/>);
    })()}
    
  </div>
  )
};
export default withStyles(ButtonStyle)(CreatorManual);
