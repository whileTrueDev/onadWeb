import React, { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import styles from '../style/IntroContact.style';
import Inquiry from '../Inquiry/Inquiry'
import InquiryCreator from '../Inquiry/InquiryCreator'
import Dialog from '../../../../atoms/Dialog/Dialog';

interface IntroContactProps {
  MainUserType: boolean;
}

function IntroContact({MainUserType }: IntroContactProps): JSX.Element {
  const classes = styles();
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
          <Button
            className={MainUserType ? classes.button : classes.button2}
            onClick={() => handleOpen('marketer')}
            id="inquiry"
          >
            <Typography variant="h4" className={classes.bottomText}>
              문의하기
          </Typography>
          </Button>
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
            : (<InquiryCreator confirmClose={handleClose} />)
          }
        </Dialog>
    </section>
  );
}

export default IntroContact;
