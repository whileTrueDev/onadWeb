import React, { useState } from 'react';
import {
  Checkbox, FormControlLabel, Button,
  Typography, Input, Container, Grid, CircularProgress,
} from '@material-ui/core';
import useStyles from '../style/Inqurie.style';
import HOST from '../../../../config';
import axios from '../../../../utils/axios';
import useDialog from '../../../../utils/hooks/useDialog';
import Dialog from '../../../../atoms/Dialog/Dialog';


interface Props {
  confirmClose?: () => void;
}

const initialContent = {
  name: '',
  email: '',
  contactNumber: '',
  brandName: '',
  brandPage: '',
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

    setLoading(true);
    if (checked) {
      axios.post(`${HOST}/mail/inquiry`, AnonymousUser)
        .then(() => {
          confirmDialog.handleOpen();
          setInquiryContent(initialContent);
          setChecked(false);
          setLoading(false);
          setInquiryContent(initialContent);
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
              <Grid item xs={6} sm={6} className={classes.detailWrap}>
                <Typography className={classes.detailTitle}>
                  홈페이지 주소
                </Typography>
                <Input
                  className={classes.datailContent}
                  classes={{ focused: classes.inputStyle }}
                  onChange={onChange}
                  disableUnderline
                  name="brandPage"
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
            <Button onClick={(): void => {
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
