import React, { useState } from 'react';
// core ../../../components
import { makeStyles, withStyles } from '@material-ui/core/styles';
// material-ui

import Select from './MarketerManualSelect';
import StartManual from './StartManual';
import RegistManual from './RegistManual';
import ChartManual from './ChartManual';

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
const MarketerManual = (props) => {
 
    const [manual, setManual] = useState(0)
  
    const handleButton = num => {
      setManual(num);
    };
  
    const handleButtonClose = () => {
      setManual(false);
    };
    const strongStyle = {
      fontSize:'23px',
      backgroundColor: '#FFFD95',
    };
  return(
  <div>
    <Select 
    handleButton = {handleButton} 
    handleButtonClose = {handleButtonClose}
    />

       { (() => {
          if (manual === 0) return (<div></div>);
          if (manual === 1) return (<RegistManual />);
          if (manual === 2) return (<StartManual />);
          if (manual === 3) return (<ChartManual />);
    })()}
    
  </div>
)};

export default withStyles(ButtonStyle)(MarketerManual);
