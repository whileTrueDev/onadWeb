import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import axios from 'axios';
import shortid from 'shortid';
import {
  Tooltip,
  Paper,
  Typography,
  Divider,
  Modal,
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Close from '@material-ui/icons/Close';
import Done from '@material-ui/icons/Done';
import Clear from '@material-ui/icons/Clear';

import Button from '../../../components/CustomButtons/Button';
import SuccessTypo from '../../../components/Typography/Success';
import DangerTypo from '../../../components/Typography/Danger';
import terms from './contractionConfig';

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
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    fontWeight: 'bold',
  },
  sectionButton: {
    flex: 1,
    display: 'none',
    justifyContent: 'flex-end',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  inModalContent: {
    padding: theme.spacing(3),
    marginLeft: 30,
    marginRight: 55,
    outline: 'none',
  },
  inModalButton: {
    textAlign: 'center',
  },
  actionsContainer: {
    marginTop: theme.spacing(2),
    float: 'right',
  },
}));

function useModal() {
  const [modalOpen, setModalOpen] = useState(false);

  function handleModalOpen(termState) {
    setModalOpen(termState);
  }

  function handleModalClose() {
    setModalOpen(false);
  }

  return { modalOpen, handleModalOpen, handleModalClose };
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
  const { modalOpen, handleModalOpen, handleModalClose } = useModal();
  const { contractionList, handleContraction } = useContractionFlag();

  const handleUserContract = () => {
    if (contractionList.every(row => row === true)) {
      axios.post('/dashboard/creator/contraction', {
      })
        .then((res) => {
          if (res.data === true) {
            history.push('/dashboard/user');
          }
        })
        .catch((err) => {
          console.log(`계약과정오류${err}`);
        });
    } else {
      alert('아직 동의하지 않으셨어요!');
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
              style={{
                flex: 1, height: '70%', fontSize: 13,
              }}
              onClick={() => handleModalOpen(term.state)}
            >
              약관보기
            </Button>
            <Divider className={classes.divider} />
            { contractionList[index] ? <SuccessTypo><Done /></SuccessTypo>
              : (
                <Tooltip title="약관을 동의하세요!">
                  <DangerTypo>
                    <Clear />
                  </DangerTypo>
                </Tooltip>
              )
            }

          </Paper>
          { /* 약관 보기 modal */ }
          <Modal open={modalOpen === term.state} onClose={handleModalClose}>
            <div className={classes.modal}>
              {/* 위 앱 바 */}
              <AppBar color="primary" position="static">
                <Toolbar variant="dense">
                  <Typography variant="h6" color="inherit">
                    {term.title}
                  </Typography>
                  <div className={classes.sectionButton}>
                    <IconButton color="inherit" onClick={handleModalClose}>
                      <Close />
                    </IconButton>
                  </div>
                </Toolbar>
              </AppBar>
              {/* 계약 내용 */}
              <div className={classes.inModalContent}>
                {term.text.split('\n').map(sentence => (
                  <p key={shortid.generate()}>{sentence}</p>
                ))}

                {/* 버튼 */}
                <div className={classnames(classes.contentWrapper, classes.inModalButton)}>
                  <Button onClick={handleModalClose}>
                    취소
                  </Button>
                  <Button
                    color="info"
                    onClick={() => { handleContraction(index); handleModalClose(); }}
                  >
                    동의
                  </Button>
                </div>

              </div>
            </div>
          </Modal>
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

Contraction.propTypes = {
  history: PropTypes.object,
};

export default Contraction;
