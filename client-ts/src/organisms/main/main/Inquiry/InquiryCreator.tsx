import React, { useState, useRef } from 'react';
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
  homepage: '',
  inquiryContents: '',
  privacyAgreement: false
};

const InquiryResult: any = {};

function Inquire({ confirmClose }: Props): JSX.Element {
  const classes = useStyles();
  const confirmDialog = useDialog();

  // ****************************************************************
  // 개인정보 제공 동의 체크를 위한 상태
  const [checked, setChecked] = useState(false);
  function handleChange(): void {
    setChecked(!checked);
  }

  // ****************************************************************
  // 문의 정보 상태
  const [inquiryContent, setInquiryContent] = useState(initialContent);
  function onChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.currentTarget;
    InquiryResult[name] = value;
    setInquiryContent(InquiryResult);
  }

  // ****************************************************************
  // 문의 form ref
  const formRef = useRef<HTMLFormElement | null>(null);
  // 문의 요청 중 로딩에 대한 상태
  const [loading, setLoading] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const AnonymousUser = inquiryContent;
    setLoading(true);

    if (!checked) {
      setLoading(false);
      alert('개인정보수집 및 이용안내에 동의해주세요');
    } else {
      AnonymousUser.privacyAgreement = true;
      axios.post(`${HOST}/inquiry/creator`, AnonymousUser)
        .then(() => {
          confirmDialog.handleOpen();
          setInquiryContent(initialContent);
          setChecked(false);
          setLoading(false);
          // Reset all of the input values in this form
          if (formRef && formRef.current) {
            formRef.current.reset();
          }
        })
        .catch(() => {
          setLoading(false);
          alert('불편을 드려 대단히 죄송합니다.\n문의 요청중 오류가 발생했습니다.\nsupport@onad.io 메일로 보내주시면 감사하겠습니다.');
        });
    }
  }

  return (
    <Container className={classes.root}>
      <div className={classes.titleWapper}>
        <div className={classes.titleLine}/>
        <Typography variant="h4" display="inline" className={classes.title}>
          문의사항을 남겨주세요
        </Typography>
        <Typography variant="subtitle2" display="inline" className={classes.subTitle}>
          * 파란색 글씨는 필수 입력 사항입니다.
        </Typography>
      </div>
      <Grid container className={classes.contentWraper} direction="column">
        <form onSubmit={handleSubmit} className={classes.cardWrapper} ref={formRef}>
          <Grid container className={classes.card} direction="column">

            <Grid container direction="row" alignItems="center" className={classes.cardContent}>
              <Grid item xs={6} sm={6} md={4} className={classes.detailWrap}>
                <Typography className={classes.detailTitle}>
                  채널 명 또는 활동 명
                </Typography>
                <Input
                  className={classes.datailContent}
                  classes={{ focused: classes.inputStyle }}
                  autoComplete="off"
                  disableUnderline
                  onChange={onChange}
                  required
                  name="name"
                />
              </Grid>
              <Grid item xs={6} sm={6} md={4} className={classes.detailWrap}>
                <Typography className={classes.detailTitle}>
                  이메일
                </Typography>
                <Input
                  className={classes.datailContent}
                  classes={{ focused: classes.inputStyle }}
                  type="email"
                  placeholder="email@email.com"
                  autoComplete="off"
                  disableUnderline
                  onChange={onChange}
                  required
                  name="email"
                />
              </Grid>
              <Grid item xs={6} sm={6} md={4}className={classes.detailWrap}>
                <Typography className={classes.detailTitle}>
                  활동 플랫폼
                </Typography>
                <Input
                  className={classes.datailContent}
                  classes={{ focused: classes.inputStyle }}
                  autoComplete="off"
                  placeholder="Twitch, afreecaTv, Youtube 등"
                  onChange={onChange}
                  disableUnderline
                  required
                  name="usingPlatform"
                />
              </Grid>
            </Grid>

            <Grid container className={classes.cardContent}>
              <Grid item xs={12} sm={12} className={classes.detailWrap}>
                <Typography className={classes.detailTitle}>
                  내용
                </Typography>
                <Input
                  classes={{ focused: classes.inputStyle }}
                  className={classes.datailContent}
                  disableUnderline
                  onChange={onChange}
                  multiline
                  required
                  rows={5}
                  name="inquiryContents"
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
                문의하기
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
