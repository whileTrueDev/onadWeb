import React, { useState } from 'react';
// core ../../../components
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowUpward from '@material-ui/icons/ArrowUpward';

// material-ui
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import Fab from '../../../components/Fab/Fab';

import Select from './MarketerManualSelect';
import StartManual from './StartManual';
import RegistManual from './RegistManual';
import ChartManual from './ChartManual';

const useStyles = makeStyles(theme => ({
  upwardButton: {
    right: 25,
    bottom: 20,
    position: 'fixed',
    margin: theme.spacing(1),
    color: '#fff',
  },
}));

const MarketerManual = (props) => {
  const { pannelRef } = props;
  const classes = useStyles();
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

  function handleUpward() {
    pannelRef.current.scrollTop = 50;
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={6} md={3}>
        <Select handleButton={handleButton} activeStep={manual} />
      </GridItem>

      <GridItem xs={12} sm={6} md={9}>
        {selectedComponent}
      </GridItem>
      <Fab color="info" size="medium" className={classes.upwardButton} onClick={handleUpward}>
        <ArrowUpward />
      </Fab>
    </GridContainer>
  );
};

export default MarketerManual;
