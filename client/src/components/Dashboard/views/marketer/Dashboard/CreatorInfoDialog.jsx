import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// cores
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

import Dialog from '../../../components/Dialog/Dialog';

const useStyles = makeStyles(theme => ({
  inDialogContent: {
    padding: theme.spacing(2),
    marginLeft: 30,
    marginRight: 55,
    outline: 'none',
  },
  content: {
    marginBottom: theme.spacing(2),
  },
}));

const CreatorInfoDialog = (props) => {
  const classes = useStyles();
  const {
    open, handleDialogClose, creatorName, tableData,
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
    <Dialog
      open={open}
      onClose={handleDialogClose}
      title={`크리에이터 ${creatorName}`}
    >
      {/* 모달내용 */}
      <div className={classes.inDialogContent}>
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
    </Dialog>
  );
};

CreatorInfoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  creatorName: PropTypes.string,
  tableData: PropTypes.array,
};

CreatorInfoDialog.defaultProps = {
  creatorName: '',
  tableData: [['']],
};

export default CreatorInfoDialog;
