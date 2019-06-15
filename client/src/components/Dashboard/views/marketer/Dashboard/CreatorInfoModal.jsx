import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// cores
import makeStyles from '@material-ui/core/styles/makeStyles';
import Modal from '@material-ui/core/Modal';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
// icons
import Close from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  modal: {
    position: 'absolute',
    top: '50%',
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
  content: {
    marginBottom: theme.spacing(2),
  },
}));

const CreatorInfoModal = (props) => {
  const classes = useStyles();
  const {
    open, handleModalClose, creatorName, tableData,
  } = props;

  const [data, setData] = useState(tableData);

  useEffect(() => {
    tableData.map((row) => {
      if (row[0] === creatorName) {
        setData(row);
      }
      return row;
    });
  }, [creatorName, tableData]);

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
    >
      <div className={classes.modal}>
        {/* 상위 바 */}
        <AppBar color="primary" position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit">
              {`크리에이터 ${creatorName}`}
            </Typography>
            <div className={classes.sectionButton}>
              <IconButton color="inherit" onClick={handleModalClose}>
                <Close />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        {/* 모달내용 */}
        <div className={classes.inModalContent}>
          <Typography variant="h5" className={classes.content}>
            {`이름 : ${creatorName}`}
          </Typography>
          <Typography variant="h5" className={classes.content}>
            {`방송 플랫폼 : ${data[1]}`}
          </Typography>
          <Typography variant="h5" className={classes.content}>
            {`방송당 평균 시청자 수 : ${data[3]}`}
          </Typography>
          <Typography variant="h5" className={classes.content}>
            {`가장 많이 하는 방송 카테고리 : ${data[2]}`}
          </Typography>
          <Typography variant="h5" className={classes.content}>
            {`1시간 당 광고 비용 : ${data[4]}`}
          </Typography>

        </div>
      </div>
    </Modal>
  );
};

CreatorInfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  creatorName: PropTypes.string,
  tableData: PropTypes.array,
};

CreatorInfoModal.defaultProps = {
  creatorName: '',
};

export default CreatorInfoModal;
