import React, {useState} from 'react';
import PropTypes from 'prop-types';
import axios from '../../../../../utils/axios';
import HOST from '../../../../../utils/config';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Input,
  Container,
  Grid} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import history from '../../../../../history';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(5),
  },
  title: {
    fontFamily: 'Noto Sans KR',
    marginTop:  '20px',
    marginBottom: '30px',
    fontWeight: '500',
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
    margin: `20px auto`,
    wordBreak: 'keep-all',
    // 브레이크 포인트 나눠서 반응형 내용추가 => 폭 너비 및 폰트크기
  },
  cardWrapper: {
    zIndex: 1,
    width: '100%'
  },
  card: {
    margin: `20px auto`,
    border: `2px solid #00DBE0`,
    borderRadius: '10px',
    padding: theme.spacing(8, 3),
    width: '70%'
  },
  cardContent: {
    marginBottom: theme.spacing(5),
  },
  datailContent: {
    minWidth: 30,
    marginTop: theme.spacing(2),
    borderRadius: 3,
    border: `1px solid #dddd`,
    width: '100%',
    '&:hover': {
      border: `1px solid #007be0`
    }
  },
  textField: {
    width: '100%',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  checkboxRoot: {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  detailWrap: {
    padding: `0 16px`
  },
  checked: {},
  button: {
    width: '28%',
    background: 'linear-gradient(45deg, #00DBE0 30%, #21CBF3 90%)',
    color: 'white',
    height: '50px',
    fontSize: "20px",
    fontFamily: 'Noto Sans KR'
  },
  detailTitle: {
    fontFamily: 'Noto Sans KR',
    fontWeight: 600,
    color: '#00DBE0',
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
    }
  },
  inputStyle: {
    boxShadow: `0px 0px 5px #00ace0`,
    border: `1px solid #007be0`
  }
}));

const Inquire = () => {
  
  const classes = useStyles();
  const [checked, setChecked] = useState(false);

  function handleChange() {
    setChecked(!checked)
  };

  

  function handleSubmit(e) {
    e.preventDefault();

    const formContent = document.forms["inqurireForm"]

    const AnonymousUser = {
      name: formContent["name"].value,
      email: formContent["email"].value,
      contactNumber: formContent["contactNumber"].value,
      brandName: formContent["brandName"].value,
      content: formContent["content"].value,
    }

    if (checked) {
      axios.post(`${HOST}/mailer/inqurie`, AnonymousUser)
      .then(() => {
        alert('캠페인 문의가 요청 되었습니다. 빠른 답변 드리겠습니다!')
        formContent["name"].value = ''
        formContent["email"].value = ''
        formContent["contactNumber"].value = ''
        formContent["brandName"].value = ''
        formContent["content"].value = ''
        setChecked(false)
        history.push('/')
      })
    } else {
      alert('개인정보수집 및 이용안내에 동의해주세요')
    }
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h3" align="center" component="h2" className={classes.title}>
        캠페인 문의하기
      </Typography>
      <Typography variant="h5" align="center" component="h2" className={classes.subTitle}>
        캠페인 제휴 문의를 남겨주시면 상담해드립니다
      </Typography>
      <Grid container className={classes.contentWraper} direction="column">
        <form onSubmit={handleSubmit} className={classes.cardWrapper} name="inqurireForm">
          <Grid container className={classes.card} direction="column">

            <Grid container direction="row" alignItems="center" className={classes.cardContent}>
              <Grid item xs={6} sm={6} className={classes.detailWrap}>
                <Typography className={classes.detailTitle}>
                  성명
                </Typography>
                <Input
                  className={classes.datailContent}
                  classes={{focused: classes.inputStyle}}
                  disableUnderline={true}
                  required={true}
                  name="name"
                />
              </Grid>
              <Grid item xs={6} sm={6} className={classes.detailWrap}>
                <Typography className={classes.detailTitle}>
                  이메일
                </Typography>
                <Input
                  className={classes.datailContent}
                  classes={{focused: classes.inputStyle}}
                  disableUnderline={true}
                  required={true}
                  name="email"
                />
              </Grid>
            </Grid>

            <Grid container direction="row" alignItems="center" className={classes.cardContent}>
              <Grid item xs={6} sm={6} className={classes.detailWrap}>
                <Typography className={classes.detailTitle}>
                  연락처
                </Typography>
                <Input
                  className={classes.datailContent}
                  classes={{focused: classes.inputStyle}}
                  disableUnderline={true}
                  required={true}
                  name="contactNumber"
                />
              </Grid>
              <Grid item xs={6} sm={6} className={classes.detailWrap}>
                <Typography className={classes.detailTitle}>
                  브랜드명
                </Typography>
                <Input
                  className={classes.datailContent}
                  classes={{focused: classes.inputStyle}}
                  disableUnderline={true}
                  name="brandName"
                />
              </Grid>
            </Grid>

            <Grid container className={classes.cardContent}>
              <Grid item xs={12} sm={12} className={classes.detailWrap}>
                <Typography className={classes.detailTitle}>
                  상세내용
                </Typography>
                <Input
                  classes={{focused: classes.inputStyle}}
                  className={classes.datailContent}
                  disableUnderline={true}
                  multiline={true}
                  required={true}
                  rows={10}
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
                  style={{margin: `20px auto`}}
                />
              </Grid>
              
              <Button
                className={classes.button}
                type="submit"
              >문의요청
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Container>
  );

}

Inquire.propTypes = {
  classes: PropTypes.object,
};

export default Inquire;
