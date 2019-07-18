import React, { useState } from 'react';
import shortid from 'shortid';
import {
  Paper,
  Typography,
  Divider,
} from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Done from '@material-ui/icons/Done';
import Clear from '@material-ui/icons/Clear';
import axios from '../../../../../utils/axios';

import Button from '../../../components/CustomButtons/Button';
import Dialog from '../../../components/Dialog/Dialog';
import SuccessTypo from '../../../components/Typography/Success';
import DangerTypo from '../../../components/Typography/Danger';
import terms from './contractionConfig';
import HOST from '../../../../../config';

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
    display: 'flex',
    backgroundColor: '#f2f2f2',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
  },
  inDialogContent: {
    padding: theme.spacing(1),
    marginLeft: 30,
    marginRight: 55,
    outline: 'none',
  },
  actionsContainer: {
    marginTop: theme.spacing(1),
    float: 'right',
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
  const { history } = props;
  const classes = useStyles();
  const { DialogOpen, handleDialogOpen, handleDialogClose } = useDialog();
  const { contractionList, handleContraction } = useContractionFlag();

  const handleUserContract = () => {
    if (contractionList.every(row => row === true)) {
      axios.post(`${HOST}/api/dashboard/creator/contraction`, {
      })
        .then((res) => {
          if (res.data === true) {
            alert('성공적으로 계약이 완료되었습니다.');
            history.push('/dashboard/creator/user');
          }
        })
        .catch(() => {
          alert('계약과정의 오류가 발생하였습니다. 잠시후 시도해주세요.');
          history.push('/dashboard/creator/user');
        });
    }
  };

  return (
    <div>
      {terms.map((term, index) => (
        <div key={term.state}>
          <Paper className={classes.container} elevation={1} key={term.state}>
            <Typography component="p" style={{ flex: 8, fontSize: 13 }}>
              {term.title}
            </Typography>
            <Button
              color="blueGray"
              onClick={() => handleDialogOpen(term.state)}
            >
              약관보기
            </Button>
            <Divider className={classes.divider} />
            { contractionList[index]
              ? <SuccessTypo><Done /></SuccessTypo>
              : (
                <DangerTypo>
                  <Clear />
                </DangerTypo>
              )}

          </Paper>
          { /* 약관 보기 Dialog */ }
          <Dialog
            open={DialogOpen === term.state}
            onClose={handleDialogClose}
            title={term.title}
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
