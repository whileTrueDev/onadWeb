import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl, Grid
} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import Button from '../../../../atoms/CustomButtons/Button';
import StyledItemText from '../../../../atoms/StyledItemText';
import StyledInput from '../../../../atoms/StyledInput';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    borderColor: 'linear-gradient(60deg, #00acc1, #26c6da)',
  },
  textField: {
    margin: theme.spacing(1),
  },
  item: {
    marginBottom: '5px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
      padding: 0,
    },
  },
}));

const IpChangerForm = (props) => {
  const {
    localIp, newIp, setIp, NowIp
  } = props;
  const [state, setState] = useState(false);
  const [useNowIp, setUseNowIp] = useState(false);
  const classes = useStyles();

  const selfButton = () => {
    setState(true);
  };
  const autoButton = () => {
    //  newIp의 값에 지금 IP 주소값을 넣어야한다.
    setIp(NowIp);
    setUseNowIp(true);
  };

  const onIpChange = (value) => {
    if (!useNowIp) {
      setIp(String(value.formattedValue));
      setUseNowIp(false);
    }
  };

  return (
    <FormControl
      className={classes.root}
      required
      margin="normal"
    >
      {state
        ? (
          <Grid container direction="column" className={classes.item} spacing={1} justify="center">
            <Grid item>
              <StyledItemText primary="IP 변경하기" fontSize="15px" />
            </Grid>
            <Grid item className={classes.textField}>
              <NumberFormat
                placeholder="___.___.___.___"
                value={newIp}
                onValueChange={onIpChange}
                customInput={StyledInput}
                margin="dense"
                format="###.###.###.###"
                mask="_"
                style={{ width: '300px' }}
                allowNegative={false}
              />
            </Grid>
          </Grid>
        )
        : (
          <Grid container direction="column" className={classes.item} spacing={1} justify="center">
            <Grid item>
              <StyledItemText primary="현재 등록된 IP" fontSize="15px" />
            </Grid>
            <Grid item className={classes.textField}>
              <NumberFormat
                value={localIp || null}
                readOnly
                customInput={StyledInput}
                margin="dense"
                format="### . ### . ### . ###"
                style={{ width: '300px' }}
                allowNegative={false}
              />
            </Grid>
          </Grid>
        )}
      {state
        ? (
          <Button
            color="info"
            onClick={autoButton}
          >
        현재 PC의 IP 주소
          </Button>
        )
        : (
          <Button
            color="info"
            onClick={selfButton}
          >
        직접 입력하러 가기
          </Button>
        )}
    </FormControl>

  );
};

export default IpChangerForm;
