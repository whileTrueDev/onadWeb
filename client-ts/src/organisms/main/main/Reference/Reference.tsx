import React from 'react';
import { Grid } from '@material-ui/core';
import shortid from 'shortid';
import useStyles from '../style/Reference.style';
import urlsource from '../source/sources';


function Reference(): JSX.Element {
  const classes = useStyles();

  // 이미지 부족... 페이지 좀 어중간함... 삭제

  return (
    <div className={classes.root}>
      <Grid container spacing={4} direction="row" justify="center" alignItems="center" className={classes.wrapper}>
        {urlsource.Reference.map((element) => (
          <Grid
            item
            key={shortid.generate()}
            className={classes.ImageSelector}
          >
            <img
              src={element.imageUrl}
              className={classes.image}
              alt="clientImage"
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Reference;
