import React, { useState } from 'react';
import shortid from 'shortid';
import {
  Paper,
  Typography,
  Divider,
  Grid,
} from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Done from '@material-ui/icons/Done';
import Clear from '@material-ui/icons/Clear';
import axios from '../../../utils/axios';

import Button from '../../../atoms/CustomButtons/Button';
import Dialog from '../../../atoms/Dialog/Dialog';
import SuccessTypo from '../../../atoms/Typography/Success';
import DangerTypo from '../../../atoms/Typography/Danger';
import terms from './contractionConfig';
import HOST from '../../../utils/config';
import history from '../../../history';

const useStyles = makeStyles(theme => ({
  checked: {},
  checkboxRoot: {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  divider: {
    width: 2,
    height: 28,
    margin: 10,
  },
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    // display: 'flex',
    backgroundColor: '#f2f2f2',
    // flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    fontSize: 13,
  },
  inDialogContent: {
    padding: theme.spacing(1),
    outline: 'none',
    [theme.breakpoints.down('xs')]: {
      fontWeight: 500,
      fontSize: '10px',
    },
  },
  actionsContainer: {
    marginTop: theme.spacing(1),
    float: 'right',
  },
  termTitle: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },
  },
}));

function useDialog() {
  const [DialogOpen, setDialogOpen] = useState(false);

  function handleDialogOpen(termState) {
    setDialogOpen(termState);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  return { DialogOpen, handleDialogOpen, handleDialogClose };
}

function useContractionFlag() {
  const [contractionList, setContractionList] = useState([false, false]);

  function handleContraction(targetIndex) {
    // 해당 인덱스의 값만 true 로 변환
    const newData = [...contractionList];
    newData.forEach((data, index) => {
      if (index === targetIndex) {
        newData[index] = true;
      }
    });

    setContractionList(newData);
  }

  return { contractionList, handleContraction };
}

function Contraction(props) {
  const { setSnackOpen } = props;
  const classes = useStyles();
  const { DialogOpen, handleDialogOpen, handleDialogClose } = useDialog();
  const { contractionList, handleContraction } = useContractionFlag();

  const handleUserContract = () => {
    if (contractionList.every(row => row === true)) {
      axios.post(`${HOST}/api/dashboard/creator/contraction`, {
      })
        .then((res) => {
          if (res.data === true) {
            // history.push('/dashboard/creator/user');
            setSnackOpen(true);
          }
        })
        .catch(() => {
          alert('계약과정의 오류가 발생하였습니다. 잠시후 시도해주세요.');
          history.push('/dashboard/creator/user');
        });
    }
  };

  // const handleWelcomeBanner = () => {
  //   if (contractionList.every(row => row === true)) {
  //     axios.post(`${HOST}/api/dashboard/creator/welcome`, {})
  //       .then(
  //         (res) => {
  //           if (res.data === true) { alert('성공적으로 계약이 완료되었습니다.'); }
  //           history.push('/dashboard/creator/user');
  //         },
  //       )
  //       .catch((res) => {
  //         alert('계약과정의 오류가 발생하였습니다. 잠시후 시도해주세요.');
  //         history.push('/dashboard/creator/user');
  //       });
  //   }
  // };

  return (
    <div>
      {terms.map((term, index) => (
        <div key={term.state}>
          <Paper className={classes.container} elevation={1} key={term.state}>
            <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
              <Grid item>
                <Typography component="p" className={classes.termTitle}>
                  {term.title}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container direction="row" alignItems="center">
                  <Grid item>
                    <Button
                      color="blueGray"
                      onClick={() => handleDialogOpen(term.state)}
                    >
                약관보기
                    </Button>
                  </Grid>
                  <Grid>
                    <Divider className={classes.divider} />
                  </Grid>
                  <Grid item>
                    { contractionList[index]
                      ? <SuccessTypo><Done /></SuccessTypo>
                      : (
                        <DangerTypo>
                          <Clear />
                        </DangerTypo>
                      )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
          { /* 약관 보기 Dialog */ }
          <Dialog
            open={DialogOpen === term.state}
            onClose={handleDialogClose}
            title={term.title}
            maxWidth="md"
            buttons={(
              <div>
                <Button onClick={handleDialogClose}>
                    취소
                </Button>
                <Button
                  color="info"
                  onClick={() => { handleContraction(index); handleDialogClose(); }}
                >
                    동의
                </Button>
              </div>
            )}
          >
            {/* 계약 내용 */}
            <div className={classes.inDialogContent}>
              {term.text.split('\n').map(sentence => (
                <p key={shortid.generate()}>{sentence}</p>
              ))}
            </div>
          </Dialog>
        </div>
      ))}
      {/* 버튼 */}
      <div className={classes.actionsContainer}>
        <Button
          variant="contained"
          color="info"
          // onClick={handleUserContract}
          onClick={handleUserContract}
          disabled={!(contractionList.every(row => row === true))}
          className={classes.button}
        >
            확인
        </Button>
      </div>
    </div>
  );
}


export default Contraction;
