import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { TextField } from '@material-ui/core';
import Muted from '../../../../components/Typography/Muted';
import Dialog from '../../../../components/Dialog/Dialog';
import Button from '../../../../components/CustomButtons/Button';
import HOST from '../../../../../../config';
import axios from '../../../../../../utils/axios';

const useStyles = makeStyles(theme => ({
  flex: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  content: {
    flexDirection: 'column',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    float: 'center'
  },
  textField: {
    width: '60%',
    marginTop: '15px',
    borderColor: '#00acc1',
    '& .MuiFormLabel-root ': {
      color: '#00acc1',
    },
    '& .MuiInputBase-input:before': {
      color: '#00acc1',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#00acc1',
    },
  }
}));

export default function TaxBillRequestDialog(props) {
  const {
    open, handleClose, handleSnackOpen, userMail
  } = props;
  const classes = useStyles();
  const [email, setEmail] = React.useState('');

  function handleClick() {
    axios.post(`${HOST}/api/dashboard/marketer/profile/taxbill`, {
      email
    })
      .then((res) => {
        if (res.data[0]) {
          // 신청 성공
          handleClose();
          handleSnackOpen();
        }
      })
      .catch((err) => {
        console.log(err);
        alert('등록에 실패했습니다. 본사에 문의해주세요.');
      });
  }

  React.useEffect(() => {
    setEmail(userMail);
  }, [userMail]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <div>
        <div className={classnames([classes.flex, classes.content])}>
          <Typography variant="body1">세금계산서를 신청하시겠습니까?</Typography>
          <Typography variant="body1">세금계산서는 처리 이후 기입한 이메일로 전송됩니다. </Typography>

          <Muted variant="body2">* 메일주소를 변경하지 않는 경우 회원가입시 등록한 이메일로 전송됩니다. </Muted>

          <TextField
            required
            label="메일 주소"
            value={email}
            placeholder={email}
            onChange={(e) => { setEmail(e.target.value); }}
            className={classes.textField}
            id="mail"
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </div>

        <div className={classes.flex}>
          <Button
            color="info"
            onClick={handleClick}
          >
              신청
          </Button>
          <Button onClick={() => { setEmail(userMail); handleClose(); }}>
              취소
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

TaxBillRequestDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSnackOpen: PropTypes.func.isRequired,
  userMail: PropTypes.string
};

TaxBillRequestDialog.defaultProps = {
  userMail: ''
};
