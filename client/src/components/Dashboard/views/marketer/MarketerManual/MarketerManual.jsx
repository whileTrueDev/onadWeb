import React, { useState } from 'react';
// core ../../../components
import { makeStyles, withStyles } from '@material-ui/core/styles';
// material-ui
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';

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
  const [manual, setManual] = useState(0);

  const handleButton = (num) => {
    setManual(num);
  };

  let selectedComponent;
  switch (manual) {
    case 1:
      selectedComponent = <RegistManual />;
      break;
    case 2:
      selectedComponent = <StartManual />;
      break;
    case 3:
      selectedComponent = <ChartManual />;
      break;
    default:
      selectedComponent = null;
  }


  return (
    <GridContainer>
      <GridItem xs={12} sm={6} md={3}>
        <Select handleButton={handleButton} activeStep={manual} />
      </GridItem>

      <GridItem xs={12} sm={6} md={9}>
        {selectedComponent}
      </GridItem>
    </GridContainer>
  );
};

export default withStyles(ButtonStyle)(MarketerManual);
