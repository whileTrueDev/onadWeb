// material-UI
import { Button, Typography } from '@material-ui/core';
// 내부 소스

// 프로젝트 내부 모듈
import { useState } from 'react';
import * as React from 'react';
// 컴포넌트
import Inquiry from '../inquiry/inquiry';
import InquiryCreator from '../inquiry/inquiryCreator';
import Dialog from '../../../atoms/dialog/dialog';
import CreatorLoginForm from '../../login/creatorLoginForm';
import MarketerLoginForm from '../../login/marketerLoginForm';
// util 계열

// 스타일
import styles from '../../../styles/main/contact/contact.style';



interface ContactProps {
  MainUserType: boolean;
  source: {
    content: {
      title: string;
      text: string;
      location: string;
    };
  };
  isLogin: boolean;
  logout: () => void;
}

function Contact({ source, MainUserType, isLogin, logout }: ContactProps): JSX.Element {
  const classes = styles();
  const [loginValue, setLoginValue] = React.useState('');

  function handleDialogOpenClick(newValue: string): void {
    setLoginValue(newValue);
  }

  function handleDialogClose(): void {
    setLoginValue('');
  }

  function useDialog(): any {
    const [open, setOpen] = useState(false);
    const [isMarketer, setIsMarketer] = useState(false);

    function handleOpen(buttonType: string): void {
      setIsMarketer(buttonType === 'marketer');
      setOpen(true);
    }
    function handleClose(): void {
      setOpen(false);
    }
    return {
      open,
      isMarketer,
      handleOpen,
      handleClose,
    };
  }

  const { open, handleOpen, handleClose } = useDialog();

  return (
    <section className={classes.root}>
      <div className={classes.top}>
        <div className={MainUserType ? classes.topLeftLine : classes.topLeftLine2} />
        <div>
          <Typography variant="h4" style={{ marginBottom: '8px' }} className={classes.topText}>
            {source.content.title}
          </Typography>
          <Typography variant="h5" className={classes.topText}>
            {source.content.text}
          </Typography>
        </div>
      </div>
      <div className={MainUserType ? classes.bottom : classes.bottom2}>
        <Typography variant="h3" className={classes.bottomText}>
          지금 바로 온애드와 시작해보세요
        </Typography>
        <div>
          <Button
            className={MainUserType ? classes.button : classes.button2}
            onClick={() => handleOpen('marketer')}
            id="inquiry"
          >
            <Typography variant="h4" className={classes.bottomText}>
              문의하기
            </Typography>
          </Button>

          {!isLogin ? (
            <Button
              className={MainUserType ? classes.button : classes.button2}
              onClick={() => handleDialogOpenClick(MainUserType ? 'marketer' : 'creator')}
            >
              <Typography variant="h4" className={classes.bottomText}>
                시작하기
              </Typography>
            </Button>
          ) : (
            <Button className={MainUserType ? classes.button : classes.button2} onClick={logout}>
              <Typography variant="h4" className={classes.bottomText} onClick={logout}>
                로그아웃
              </Typography>
            </Button>
          )}
        </div>
      </div>
      <Dialog
        open={Boolean(open)}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        buttons={
          <div>
            <Button onClick={handleClose}>취소</Button>
          </div>
        }
      >
        {MainUserType ? (
          <Inquiry confirmClose={handleClose} />
        ) : (
          <InquiryCreator confirmClose={handleClose} />
        )}
      </Dialog>
      <MarketerLoginForm
        open={loginValue === 'marketer'}
        handleClose={handleDialogClose}
        logout={logout}
      />
      <CreatorLoginForm open={loginValue === 'creator'} handleClose={handleDialogClose} />
    </section>
  );
}

export default Contact;
