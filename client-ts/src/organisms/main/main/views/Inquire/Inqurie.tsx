import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Input,
  Container,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import HOST from '../../../../../config';
import axios from '../../../../../utils/axios';
import useDialog from '../../../../../utils/hooks/useDialog';
import Dialog from '../../../../../atoms/Dialog/Dialog';
import { initialState } from '../../../regist/Stepper.reducer';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(5),
  },
  title: {
    fontFamily: 'Noto Sans KR',
    marginTop: '20px',
    marginBottom: '30px',
    fontWeight: 600,
    wordBreak: 'keep-all',
    [theme.breakpoints.down('sm')]: {
      fontSize: '25px',
    }
  },
  subTitle: {
    fontFamily: 'Noto Sans KR',
    wordBreak: 'keep-all',
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
    }
  },
  contentWraper: {
    margin: '20px auto',
    wordBreak: 'keep-all',
    // 브레이크 포인트 나눠서 반응형 내용추가 => 폭 너비 및 폰트크기
  },
  cardWrapper: {
    zIndex: 1,
    width: '100%'
  },
  card: {
    margin: '20px auto',
    border: '2px solid #3154EB',
    borderRadius: '10px',
    padding: theme.spacing(8, 3),
    width: '70%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    }
  },
  cardContent: {
    marginBottom: theme.spacing(5),
  },
  datailContent: {
    minWidth: 30,
    marginTop: theme.spacing(2),
    borderRadius: 3,
    border: '1px solid #dddd',
    width: '100%',
    '&:hover': {
      border: '1px solid #3154EB'
    }
  },
  textField: {
    width: '100%',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  checkboxRoot: {
    color: '#3154EB',
    '&$checked': {
      color: '#3154EB',
    },
  },
  detailWrap: {
    padding: '0 16px',
    [theme.breakpoints.down('xs')]: {
      padding: '0 10px',
    }
  },
  checked: {},
  button: {
    width: '200px',
    background: '#3154EB',
    color: 'white',
    height: '50px',
    fontSize: '20px',
    fontFamily: 'Noto Sans KR',
    [theme.breakpoints.down('xs')]: {
      width: '150px',
    }
  },
  detailTitle: {
    fontFamily: 'Noto Sans KR',
    fontWeight: 600,
    color: '#3154EB',
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
    }
  },
  inputStyle: {
    boxShadow: '0px 0px 5px #00ace0',
    border: '1px solid #3154EB'
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

interface Props {
  confirmClose?: () => void;
}

const initialContent = {
  name: '',
  email: '',
  contactNumber: '',
  brandName: '',
  content: ''
};

const InquiryResult: any = {};

function Inquire({ confirmClose }: Props): JSX.Element {
  const classes = useStyles();
  const [checked, setChecked] = useState(false);
  const confirmDialog = useDialog();
  const [inquiryContent, setInquiryContent] = useState(initialContent);
  const [loading, setLoading] = React.useState(false);


  function handleChange(): void {
    setChecked(!checked);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.currentTarget;
    InquiryResult[name] = value;
    setInquiryContent(InquiryResult);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const AnonymousUser = inquiryContent;

    console.log(AnonymousUser);
    setLoading(true);
    if (checked) {
      axios.post(`${HOST}/mail/inquiry`, AnonymousUser)
        .then(() => {
          confirmDialog.handleOpen();
          setInquiryContent(initialContent);
          setChecked(false);
          setLoading(false);
        });
    } else {
      setLoading(false);
      alert('개인정보수집 및 이용안내에 동의해주세요');
    }
  }

  return (
    <Container className={classes.root}>
      <Typography variant="h3" align="center" component="h2" className={classes.title}>
        광고 문의하기
      </Typography>
      <Typography variant="h5" align="center" component="h2" className={classes.subTitle}>
        광고 관련 문의를 남겨주시면 상담해드립니다
      </Typography>
      <Grid container className={classes.contentWraper} direction="column">
        <form onSubmit={handleSubmit} className={classes.cardWrapper} id="inquireForm">
          <Grid container className={classes.card} direction="column">

            <Grid container direction="row" alignItems="center" className={classes.cardContent}>
              <Grid item xs={6} sm={6} className={classes.detailWrap}>
                <Typography className={classes.detailTitle}>
                  * 성명
                </Typography>
                <Input
                  className={classes.datailContent}
                  classes={{ focused: classes.inputStyle }}
                  disableUnderline
                  onChange={onChange}
                  required
                  name="name"
                />
              </Grid>
              <Grid item xs={6} sm={6} className={classes.detailWrap}>
                <Typography className={classes.detailTitle}>
                  * 이메일
                </Typography>
                <Input
                  className={classes.datailContent}
                  classes={{ focused: classes.inputStyle }}
                  disableUnderline
                  onChange={onChange}
                  required
                  name="email"
                />
              </Grid>
            </Grid>

            <Grid container direction="row" alignItems="center" className={classes.cardContent}>
              <Grid item xs={6} sm={6} className={classes.detailWrap}>
                <Typography className={classes.detailTitle}>
                  * 연락처
                </Typography>
                <Input
                  className={classes.datailContent}
                  classes={{ focused: classes.inputStyle }}
                  onChange={onChange}
                  disableUnderline
                  required
                  name="contactNumber"
                />
              </Grid>
              <Grid item xs={6} sm={6} className={classes.detailWrap}>
                <Typography className={classes.detailTitle}>
                  브랜드명
                </Typography>
                <Input
                  className={classes.datailContent}
                  classes={{ focused: classes.inputStyle }}
                  onChange={onChange}
                  disableUnderline
                  name="brandName"
                />
              </Grid>
            </Grid>

            <Grid container className={classes.cardContent}>
              <Grid item xs={12} sm={12} className={classes.detailWrap}>
                <Typography className={classes.detailTitle}>
                  * 상세내용 (배너제작에 관한 내용도 질문바랍니다)
                </Typography>
                <Input
                  classes={{ focused: classes.inputStyle }}
                  className={classes.datailContent}
                  disableUnderline
                  onChange={onChange}
                  multiline
                  required
                  rows={5}
                  name="content"
                />
              </Grid>
            </Grid>

            <Grid container direction="column" alignItems="center">
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      onChange={handleChange}
                      checked={checked}
                      classes={{
                        root: classes.checkboxRoot,
                        checked: classes.checked,
                      }}
                    />
                  )}
                  label="개인정보수집 및 이용안내에 동의합니다."
                  style={{ margin: '20px auto' }}
                />
              </Grid>

              <Button
                className={classes.button}
                type="submit"
                disabled={loading}
              >
                문의 남기기
                {loading && (
                  <CircularProgress
                    disableShrink
                    size={16}
                    thickness={5}
                    variant="indeterminate"
                    className={classes.buttonProgress}
                  />
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Dialog
        open={Boolean(confirmDialog.open)}
        onClose={confirmDialog.handleClose}
        fullWidth
        maxWidth="xs"
        buttons={(
          <div>
            <Button onClick={() => {
              confirmDialog.handleClose();
              if (confirmClose) { confirmClose(); }
            }}
            >
              확인
            </Button>
          </div>
        )}
      >
        <p style={{ textAlign: 'center', fontSize: '20px', marginTop: 30 }}>문의 요청 완료되었습니다.</p>
        <p style={{ textAlign: 'center', fontSize: '20px' }}>빠른 답변 드리겠습니다.</p>
      </Dialog>
    </Container>
  );
}

export default Inquire;
