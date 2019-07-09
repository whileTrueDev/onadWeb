import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
// core ../../../components
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import GridContainer from '../../../components/Grid/GridContainer';
import Table from '../../../components/Table/Table';
import Danger from '../../../components/Typography/Danger';
import Info from '../../../components/Typography/Info';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardIcon from '../../../components/Card/CardIcon';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import GridItem from '../../../components/Grid/GridItem';
//material-ui
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';

//
import broadCastingIcon from '../../../assets/img/broadcasting.svg';
import Select from './Select'
import SetBanner from './SetBanner'
import ContractManual from './ContractManual'
import ProgramSetting from './ProgramSetting'
import IncomeManual from './IncomeManual'
import WithdrawalManual from './WithdrawalManual'

//

const ButtonStyle = makeStyles({
  root: {
    background: 'white',
    borderRadius: 3,
    border: 0,
    color: 'black',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    width : '300px',
    height : '100px',
  },
  label: {
    textTransform: 'capitalize',
    flexDirection: 'column',
  },
});

const CreatorManual = (props) => {
  // const classes = ButtonStyle();

  return (
    <div>
      <Select/>
      <ContractManual/>
      <SetBanner/>
      <ProgramSetting/>
      <IncomeManual/>
      <WithdrawalManual/>
    </div>
  )
}

export default withStyles(ButtonStyle)(CreatorManual);