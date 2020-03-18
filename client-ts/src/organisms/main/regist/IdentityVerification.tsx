import React, { useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fingerprint from '@material-ui/icons/Fingerprint';
import {
  Grid, Button, Typography
} from '@material-ui/core';
import axios from '../../../utils/axios';
import HOST from '../../../config';
import CustomCard from '../../../atoms/CustomCard';
import StyledItemText from '../../../atoms/StyledItemText';

const useStyles = makeStyles((theme) => ({
  stats: {
    color: '#999',
    display: 'inline-flex',
    fontSize: '14px',
    lineHeight: '22px',
    '& svg': {
      top: '4px',
      width: '16px',
      height: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      top: '4px',
      fontSize: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  head: {
    fontWeight: 500,
    color: theme.palette.info.main,
  },
  unit: {
    fontWeight: 700,
    marginLeft: '3px'
  },
  level: {
    fontWeight: 700,
    marginLeft: '1px'
  },
  text1: {
    fontWeight: 500,
    // color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '14px',
    margin: '16px',
    marginBottom: '3px'
  },
  text2: {
    fontWeight: 500,
    // color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '14px',
    margin: '16px',
    marginTop: 0
  }
}));

interface Props {
  handleBack: () => void;
  handleNext: () => void;
  open: number;
  setOpen: (number: number) => void;
}

// 마케터 유형을 선택하고 난 뒤 rendering되는 컴포넌트.
// useEffect를 사용하여
function IndentityVerification({
  handleBack,
  handleNext,
  open,
  setOpen
}: Props): JSX.Element {
  const classes = useStyles();

  const submitImpUid = useCallback(({ impUid }) => {
    axios.post(`${HOST}/marketer/certification`, { imp_uid: impUid })
      .then((res) => {
        const { error, data } = res.data;
        if (error) {
          alert(data.msg);
          handleBack();
        } else if (data.minor) {
          alert('미성년자는 이용할 수 없습니다.');
          handleBack();
        } else {
          alert('본인인증이 성공하였습니다.');
          handleNext();
        }
      })
      .catch(() => {
        alert('본인인증이 실패하였습니다.');
        handleBack();
      });
  }, [handleBack, handleNext]);

  useEffect(() => {
    if (open) {
      const globalParams: any = window;
      const { IMP } = globalParams;
      IMP.init('imp00026649');

      IMP.certification({ // param
        merchant_uid: 'ORD20180131-0000011',
        min_age: '19'
      }, (rsp: any) => { // callback
        if (rsp.success) {
          submitImpUid({ impUid: rsp.imp_uid });
        } else {
          handleBack();
        }
      });
      setOpen(0);
    }
  }, [handleBack, open, setOpen, submitImpUid]);


  return (
    <Grid container direction="column">
      <Grid item xs={6}>
        <CustomCard
          iconComponent={<Fingerprint />}
          buttonComponent={(
            <StyledItemText
              primary="미성년자 확인"
              secondary="만 19세 미만인 경우 온애드를 사용할 수 없습니다."
            />
          )}
        >
          <Typography align="right" className={classes.text1}>대한민국 민법상, 만 19세에 달하지 않은자는 회원가입이 불가능 합니다.</Typography>
          <Typography align="right" className={classes.text2}>미성년자가 아닌경우, 다음버튼을 클릭해 본인인증을 진행하세요.</Typography>

        </CustomCard>
      </Grid>
      <Grid item style={{ marginTop: '16px' }} xs={6}>
        <div>
          <Button
            onClick={handleBack}
          >
            뒤로
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => { setOpen(1); }}
          >
            다음
          </Button>
        </div>
      </Grid>
    </Grid>

  );
}

export default IndentityVerification;
