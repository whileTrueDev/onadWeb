import React, { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import styles from '../style/IntroContact.style';
import Inquiry from '../Inquiry/Inquiry';
import InquiryCreator from '../Inquiry/InquiryCreator';
import Dialog from '../../../../atoms/Dialog/Dialog';
import CreatorLoginForm from '../login/CreatorLoginForm';
import MarketerLoginForm from '../login/MarketerLoginForm';

interface IntroContactProps {
  MainUserType: boolean;
  isLogin: boolean;
  logout: () => void;
}

function IntroContact({ MainUserType, isLogin, logout }: IntroContactProps): JSX.Element {
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
      open, isMarketer, handleOpen, handleClose,
    };
  }

  const {
    open, handleOpen, handleClose
  } = useDialog();

  return (
    <section className={classes.root}>
      <div className={MainUserType ? classes.bottom : classes.bottom2}>
        <Typography variant="h2" className={classes.bottomText}>
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

          { !isLogin ? (
            <Button
              className={MainUserType ? classes.button : classes.button2}
              onClick={() => handleDialogOpenClick(MainUserType ? 'marketer' : 'creator')}
            >
              <Typography variant="h4" className={classes.bottomText}>
                시작하기
              </Typography>
            </Button>
          ) : (
            <Button
              className={MainUserType ? classes.button : classes.button2}
              onClick={logout}
            >
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
        buttons={(
          <div>
            <Button onClick={handleClose}>
              취소
            </Button>
          </div>
          )}
      >
        { MainUserType
          ? (<Inquiry confirmClose={handleClose} />)
          : (<InquiryCreator confirmClose={handleClose} />)}
      </Dialog>
      <MarketerLoginForm
        open={loginValue === 'marketer'}
        handleClose={handleDialogClose}
        logout={logout}
      />
      <CreatorLoginForm
        open={loginValue === 'creator'}
        handleClose={handleDialogClose}
      />
    </section>
  );
}

export default IntroContact;
