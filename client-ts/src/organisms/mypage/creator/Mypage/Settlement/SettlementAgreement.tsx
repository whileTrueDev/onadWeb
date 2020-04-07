import React, { useState } from 'react';
import { Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import shortid from 'shortid';
import AgreementSource from '../source/source';

const useStyles = makeStyles((theme: Theme) => ({
  textField: {
    width: '100%',
    margin: '20px 0',
    height: 150,
    overflowX: 'hidden',
    overflowY: 'auto',
    border: 'solid 1px #00acc1'
  },
  checked: {},
  checkboxRoot: {
    color: theme.palette.success.main,
    '&$checked': {
      color: theme.palette.success.main,
    },
    marginLeft: 20
  },
}));

function SettlementAgreement(): JSX.Element {
  const classes = useStyles();
  const [checkA, setCheckA] = useState<boolean>(false);
  const [checkB, setCheckB] = useState<boolean>(false);
  const [checkC, setCheckC] = useState<boolean>(false);

  function checkBoxHandleChange(name: string): void {
    switch (name) {
      case 'checkA':
        return setCheckA(!checkA);
      case 'checkB':
        return setCheckB(!checkB);
      default:
        return setCheckC(!checkC);
    }
  }

  return (
    <>
      <Grid item className={classes.textField}>
        {AgreementSource.creatorAgreement.split('\n').map((sentence) => (
          <p key={shortid.generate()}>{sentence}</p>
        ))}
      </Grid>
      <Grid item>
        크리에이터 서비스 이용약관(필수)
        <FormControlLabel
          control={(
            <Checkbox
              onChange={(): void => { checkBoxHandleChange('checkA'); }}
              checked={checkA}
              value={checkA}
              classes={{
                root: classes.checkboxRoot,
                checked: classes.checked,
              }}
            />
          )}
          label="동의"
          style={{ flex: 2, marginRight: 0 }}
        />
      </Grid>
      <Grid item className={classes.textField}>
        {AgreementSource.privacyAgreement.split('\n').map((sentence) => (
          <p key={shortid.generate()}>{sentence}</p>
        ))}
      </Grid>
      <Grid item>
        정산 등록에 따른 개인정보 수집 및 이용동의(필수)
        <FormControlLabel
          control={(
            <Checkbox
              onChange={(): void => { checkBoxHandleChange('checkB'); }}
              checked={checkA}
              value={checkA}
              classes={{
                root: classes.checkboxRoot,
                checked: classes.checked,
              }}
            />
          )}
          label="동의"
          style={{ flex: 2, marginRight: 0 }}
        />
      </Grid>
      <Grid item className={classes.textField}>
        {AgreementSource.SettlementAgreement.split('\n').map((sentence) => (
          <p key={shortid.generate()}>{sentence}</p>
        ))}
      </Grid>
      <Grid item>
        정산 등록 신청서 제출에 대한 확인(필수)
        <FormControlLabel
          control={(
            <Checkbox
              onChange={(): void => { checkBoxHandleChange('checkC'); }}
              checked={checkA}
              value={checkA}
              classes={{
                root: classes.checkboxRoot,
                checked: classes.checked,
              }}
            />
          )}
          label="동의"
          style={{ flex: 2, marginRight: 0 }}
        />
      </Grid>
    </>
  );
}

export default SettlementAgreement;
