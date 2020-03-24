import React from 'react';
import {
  ButtonBase,
  Typography,
} from '@material-ui/core';
import useStyles from './style/Usertype.style';


const images = [
  {
    url: '/pngs/regist/Personal.jpg',
    title: '일반인',
    width: '50%',
  },
  {
    url: '/pngs/regist/group.jpg',
    title: '사업자',
    width: '50%',
  },
];

interface Props {
  typeChange: (type: number) => void;
  handleNext: () => void;
}

function Usertype({ typeChange, handleNext }: Props): JSX.Element {
  // props 는 전달하지 않아도 가능한가?

  const classes = useStyles();

  function changeType(title: string): void {
    if (title === '일반인') {
      typeChange(0);
    } else {
      typeChange(1);
    }
    handleNext();
  }

  return (
    <div className={classes.root}>
      {images.map((image) => (
        <ButtonBase
          focusRipple
          key={image.title}
          className={classes.image}
          focusVisibleClassName={classes.focusVisible}
          style={{
            width: image.width,
          }}
          onClick={() => changeType(image.title)}
        >
          <span
            className={classes.imageSrc}
            style={{
              backgroundImage: `url(${image.url})`,
            }}
          />
          <span className={classes.imageBackdrop} />
          <span className={classes.imageButton}>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              className={classes.imageTitle}
            >
              {image.title}
              <span className={classes.imageMarked} />
            </Typography>
          </span>
        </ButtonBase>
      ))}
    </div>
  );
}

export default Usertype;
