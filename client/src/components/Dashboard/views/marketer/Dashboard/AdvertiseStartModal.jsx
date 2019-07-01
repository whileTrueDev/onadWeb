import React, { useState } from 'react';
import axios from 'axios';
import shortId from 'shortid';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Modal from '@material-ui/core/Modal';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Close from '@material-ui/icons/Close';
import Button from '../../../components/CustomButtons/Button';

const useStyles = makeStyles(theme => ({
  modal: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
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
  input: {
    marginTop: 10,
    borderColor: '#4caf50',
    '& .MuiFormLabel-root ': {
      color: '#4caf50',
    },
    '& .MuiInputBase-input:before': {
      color: '#4caf50',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#4caf50',
    },
  },
  slider: {
    marginTop: 30,
  },
  tableHeaderWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    float: 'right',
  },
  dialogContent: {
    margin: theme.spacing(2),
  },
}));

function useConfirmModal() {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  function handleConfirmModalOpen() {
    setConfirmModalOpen(true);
  }

  function handleConfirmModalClose() {
    setConfirmModalOpen(false);
  }

  return { confirmModalOpen, handleConfirmModalClose, handleConfirmModalOpen };
}

function AdvertiseStartModal(props) {
  const {
    open, marketerDebit, onClose, selectedBanner, tableData, history,
  } = props;
  const classes = useStyles();

  const {
    confirmModalOpen, handleConfirmModalClose, handleConfirmModalOpen,
  } = useConfirmModal();

  // 해당 배너 광고 시작 버튼 클릭 시
  async function handleClick() {
    // 광고중인 배너가 아닌 경우
    if (selectedBanner.confirmState === 1) {
      // matchedBanner에, 해당 배너와 크리에이터들의 연결을 저장 DONE
    // bannerRegistered에, 배너 state를 3 으로 수정. (광고 중)
      const matchedBannerUrl = '/dashboard/marketer/bannerStart';

      const creators = [];
      tableData.map((data) => {
        creators.push(data[0]);
        return null;
      });

      const matchedBannerData = { bannerId: selectedBanner.bannerId, creators };
      await axios.post(matchedBannerUrl, matchedBannerData)
        .then((res) => {
          if (res.data === 'success') {
            console.log('done!');
          }
        })
        .catch((err) => {
          console.log(err);
        });

      const bannerRegisteredUrl = '/dashboard/marketer/bannerStartStateChange';
      const bannerRegisteredData = { bannerId: selectedBanner.bannerId };
      await axios.post(bannerRegisteredUrl, bannerRegisteredData)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (selectedBanner.confirmState === 3) {
      // 광고중인 배너인 경우
      const matchedBannerUrl = '/dashboard/marketer/bannerStop';

      const creators = [];
      tableData.map((data) => {
        creators.push(data[0]);
        return null;
      });

      const matchedBannerData = { bannerId: selectedBanner.bannerId, creators };
      await axios.post(matchedBannerUrl, matchedBannerData)
        .then((res) => {
          if (res.data === 'success') {
            console.log('done!');
          }
        })
        .catch((err) => {
          console.log(err);
        });

      const bannerRegisteredUrl = '/dashboard/marketer/bannerStopStateChange';
      const bannerRegisteredData = { bannerId: selectedBanner.bannerId };
      await axios.post(bannerRegisteredUrl, bannerRegisteredData)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    history.push('/dashboard/marketer/main');
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className={classes.modal}>
        {/* 상위 바 */}
        <AppBar color="primary" position="static">
          <Toolbar variant="dense">
            { selectedBanner.confirmState === 1
              ? (
                <Typography variant="h6" color="inherit">
              해당 배너 광고 시작하기
                </Typography>
              )
              : (
                <Typography variant="h6" color="inherit">
              해당 배너 광고 중단하기
                </Typography>
              )}

            <div className={classes.sectionButton}>
              <IconButton color="inherit" onClick={onClose}>
                <Close />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        {/* 모달내용 */}
        <div className={classes.inModalContent}>
          <img src={selectedBanner.bannerSrc} alt="selectedBanner" />
          <Typography variant="h6">{`광고 캐시 잔액 : ${marketerDebit}`}</Typography>
          { selectedBanner.confirmState === 1 && (
            <div>
              <Typography variant="h6">광고가 송출될 크리에이터 :</Typography>

              {tableData ? tableData.map(data => (
                <span key={shortId.generate()}>{`${data[0]}, `}</span>
              )) : null}
            </div>
          )}

          <div className={classes.button}>
            <Button onClick={onClose}>
              취소
            </Button>
            { selectedBanner.confirmState === 1 ? (
              <Button color="info" onClick={handleConfirmModalOpen}>
              해당 배너 광고 시작
              </Button>
            ) : (
              <Button color="warning" onClick={handleConfirmModalOpen}>
              해당 배너 광고 중단
              </Button>
            )}
          </div>
        </div>

        {/* confirm dialog */}
        <Dialog
          open={confirmModalOpen}
          keepMounted
          onClose={handleConfirmModalClose}
        >
          <DialogContent>
            { selectedBanner.confirmState === 1 ? (
              <Typography className={classes.dialogContent} variant="h6" marked="center">
                해당 배너로 광고를 시작하시겠어요?
              </Typography>
            ) : (
              <Typography className={classes.dialogContent} variant="h6" marked="center">
                해당 배너 광고를 중단 하시겠어요?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmModalClose}>
              취소
            </Button>
            <Button
              onClick={() => handleClick()}
              color={selectedBanner.confirmState === 1 ? 'info' : 'warning'}
            >
              진행
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Modal>
  );
}

AdvertiseStartModal.propTypes = {
  open: PropTypes.bool.isRequired,
  marketerDebit: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedBanner: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
};

export default AdvertiseStartModal;

/* 예산 설정
  <CustomInput
    labelText="예산을 입력 또는 선택"
    id="budget"
    value={inputValue}
    formControlProps={{
      fullWidth: false,
      className: classes.input,
    }}
    inputProps={{
      value: inputValue,
      type: 'number',
      onChange: handleInputChange,
      error: (!(inputValue <= marketerDebit)
              || (inputValue < 0)),
    }}
  />
  <Slider
    className={classes.slider}
    error={!(inputValue <= marketerDebit) || (inputValue < 0)}
    min={0}
    max={marketerDebit}
    step={marketerDebit / 10}
    value={inputValue}
    onChange={handleSliderInputChange}
  />
*/
