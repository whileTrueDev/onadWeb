import React, { useState } from 'react';
// core ../../../components
import { makeStyles } from '@material-ui/core/styles';
// material-ui
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Fab from '../../../components/Fab/Fab';
import GridItem from '../../../components/Grid/GridItem';
import GridContainer from '../../../components/Grid/GridContainer';
import Select from './Select';
import SetBanner from './SetBanner';
import ContractManual from './ContractManual';
import ProgramSetting from './ProgramSetting';
import IncomeManual from './IncomeManual';
import WithdrawalManual from './WithdrawalManual';

const useStyles = makeStyles(theme => ({
  upwardButton: {
    right: 25,
    bottom: 20,
    position: 'fixed',
    margin: theme.spacing(1),
    color: '#fff',
  },
}));

const CreatorManual = (props) => {
  const { pannelRef } = props;
  const classes = useStyles();
  const [manual, setManual] = useState(0);
  const [program, setProgram] = useState(0);

  const handleButton = (num) => {
    setManual(num);
  };

  const handleButtonClose = () => {
    setManual(false);
  };

  const typeChange = (type) => {
    setProgram(type);
  };

  function handleUpward() {
    pannelRef.current.scrollTop = 50;
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={3}>
        <Select
          handleButton={handleButton}
          handleButtonClose={handleButtonClose}
          activeStep={manual}
        />
      </GridItem>
      <GridItem xs={12} sm={12} md={9}>
        { (() => {
          if (manual === 1) return (<ContractManual />);
          if (manual === 2) return (<SetBanner />);
          if (manual === 3) {
            return (
              <ProgramSetting
                typeChange={typeChange}
              />
            );
          }
          if (manual === 4) return (<IncomeManual />);
          if (manual === 5) return (<WithdrawalManual />);
        })()}
      </GridItem>


      <Fab color="info" size="medium" className={classes.upwardButton} onClick={handleUpward}>
        <ArrowUpward />
      </Fab>

    </GridContainer>
  );
};
export default CreatorManual;
