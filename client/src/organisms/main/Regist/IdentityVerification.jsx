import React, { useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fingerprint from '@material-ui/icons/Fingerprint';
import {
  Grid, Typography, Divider, Button
} from '@material-ui/core';
import axios from '../../../utils/axios';
import HOST from '../../../utils/config';
import CustomCard from '../../../atoms/CustomCard';
import StyledItemText from '../../../atoms/StyledItemText';

const useStyles = makeStyles(({
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
    fontWeight: '500',
    color: '#455a64',
  },
  unit: {
    fontWeight: '700',
    marginLeft: '3px'
  },
  level: {
    fontWeight: '700',
    marginLeft: '1px'
  }
}));

// 마케터 유형을 선택하고 난 뒤 rendering되는 컴포넌트.
// useEffect를 사용하여
const IndentityVerification = (props) => {
  const classes = useStyles();
  const {
    handleBack, handleNext, open, setOpen, setDefaultName
  } = props;

  const submitImpUid = useCallback(({ impUid }) => {
    axios.post(`${HOST}/api/regist/certifications`, { imp_uid: impUid })
      .then((res) => {
        const { error, data } = res.data;
        if (error) {
          alert(data.msg);
          handleBack();
        } else {
          setDefaultName(data.name);
          alert('본인인증이 성공하였습니다.');
          handleNext();
        }
      })
      .catch(() => {
        alert('본인인증이 실패하였습니다.');
        handleBack();
      });
  }, [handleBack, handleNext, setDefaultName]);

  useEffect(() => {
    if (open) {
      const { IMP } = window;
      IMP.init('imp00026649');

      IMP.certification({ // param
        merchant_uid: 'ORD20180131-0000011',
        min_age: '19'
      }, (rsp) => { // callback
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
        />
      </Grid>
      <Grid item style={{ marginTop: '16px' }} xs={6}>
        <div>
          <Button
            onClick={handleBack}
            className={classes.button}
          >
              뒤로
          </Button>
        </div>
      </Grid>
    </Grid>

  );
};

export default IndentityVerification;