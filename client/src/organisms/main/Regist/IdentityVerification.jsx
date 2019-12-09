import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fingerprint from '@material-ui/icons/Fingerprint';
import {
  Grid, Typography, Divider, Button
} from '@material-ui/core';
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


const IndentityVerification = (props) => {
  const classes = useStyles();
  const { handleBack, handleNext } = props;


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
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleNext}
          >
              다음
          </Button>
        </div>
      </Grid>
    </Grid>

  );
};

export default IndentityVerification;
