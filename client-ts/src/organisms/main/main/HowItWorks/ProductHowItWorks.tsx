import React, { useState } from 'react';
import shortid from 'shortid';
import { Button, Hidden, Typography } from '@material-ui/core';
// import Typography from '../../components/Typography';
import styles from '../style/ProductHowItWorks.style';
import MarketerLoginForm from '../login/MarketerLoginForm';
import CreatorLoginForm from '../login/CreatorLoginForm';


interface Props {
  MainUserType: string;
  source: {
    content: {
      title: string;
      text: string;
      location: string;
    };
  };
  logout: () => void;
}

function ProductHowItWorks({ source, MainUserType, logout }: Props): JSX.Element {
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
    open, isMarketer, handleOpen, handleClose
  } = useDialog();

  return (
    <section className={classes.root}>
      <div className={classes.wrapper}>
        <Hidden mdDown>
          <div style={{ marginRight: '80px' }}>
            <img src="/pngs/main/mainBottomImage.PNG" className={classes.mainBottomImg} alt="mainBottomImage" />
          </div>
        </Hidden>
        <div>
          <div className={classes.mainBottom}>
            <Typography component="h2" className={classes.mainBottomtitle}>
              {source.content.title}
            </Typography>
          </div>
          <div>
            {source.content.text.split('\n').map((row) => (
              <Typography
                key={shortid.generate()}
                component="h2"
                style={{ marginTop: 12, marginBottom: 12, fontFamily: 'Noto Sans Kr' }}
                className={classes.bottomText}
              >
                {`${row}`}
              </Typography>
            ))}
          </div>
          <div className={classes.bottomButtom}>
            <Button
              className={classes.button}
              onClick={MainUserType === 'marketer' ? ((): void => handleOpen('marketer')) : (() => { handleOpen('creator'); })}
            >
              바로 시작하기
            </Button>

            <Button
              className={classes.button}
              onClick={(): void => { window.open('http://pf.kakao.com/_xoyxmfT/chat'); }}
            >
              플러스친구 문의
            </Button>

          </div>
          <Typography component="h2" className={classes.bottomSpace}>
            전화지원 및 플러스친구 답변은 월~금 (10:00~19:00)동안 운영됩니다.
          </Typography>
        </div>
        {isMarketer ? (
          <MarketerLoginForm
            open={open}
            handleClose={handleClose}
            logout={logout}
          />
        ) : (
          <CreatorLoginForm open={open} handleClose={handleClose} />
        )}
      </div>
    </section>
  );
}

export default ProductHowItWorks;
