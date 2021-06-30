import { useMemo, useState } from 'react';
import * as React from 'react';
import { Button, Typography } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import styles from '../style/Contact.style';
import Inquiry from '../Inquiry/Inquiry';
import InquiryCreator from '../Inquiry/InquiryCreator';
import Dialog from '../../../../atoms/Dialog/Dialog';
import CreatorLoginForm from '../login/CreatorLoginForm';
import MarketerLoginForm from '../login/MarketerLoginForm';
import { useAuthStore } from '../../../../store/authStore';

interface ContactProps {
  source: {
    content: {
      title: string;
      text: string;
      location: string;
    };
  };
}

function Contact({ source }: ContactProps): JSX.Element {
  const isLogin = useAuthStore(state => state.isLoggedIn);
  const logout = useAuthStore(state => state.logout);
  const { pathname } = useLocation();
  const isMarketerPage = useMemo(() => pathname.includes('/marketer'), [pathname]);

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
        <div className={isMarketerPage ? classes.topLeftLine : classes.topLeftLine2} />
        <div>
          <Typography variant="h4" style={{ marginBottom: '8px' }} className={classes.topText}>
            {source.content.title}
          </Typography>
          <Typography variant="h5" className={classes.topText}>
            {source.content.text}
          </Typography>
        </div>
      </div>
      <div className={isMarketerPage ? classes.bottom : classes.bottom2}>
        <Typography variant="h3" className={classes.bottomText}>
          지금 바로 온애드와 시작해보세요
        </Typography>
        <div>
          <Button
            className={isMarketerPage ? classes.button : classes.button2}
            onClick={() => handleOpen('marketer')}
            id="inquiry"
          >
            <Typography variant="h4" className={classes.bottomText}>
              문의하기
            </Typography>
          </Button>

          {!isLogin ? (
            <Button
              className={isMarketerPage ? classes.button : classes.button2}
              onClick={() => handleDialogOpenClick(isMarketerPage ? 'marketer' : 'creator')}
            >
              <Typography variant="h4" className={classes.bottomText}>
                시작하기
              </Typography>
            </Button>
          ) : (
            <Button className={isMarketerPage ? classes.button : classes.button2} onClick={logout}>
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
        {isMarketerPage ? (
          <Inquiry confirmClose={handleClose} />
        ) : (
          <InquiryCreator confirmClose={handleClose} />
        )}
      </Dialog>
      <MarketerLoginForm open={loginValue === 'marketer'} handleClose={handleDialogClose} />
      <CreatorLoginForm open={loginValue === 'creator'} handleClose={handleDialogClose} />
    </section>
  );
}

export default Contact;
