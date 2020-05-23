import React from 'react';
import { Grid, Hidden } from '@material-ui/core';
import shortid from 'shortid';
import useStyles from '../style/Reference.style';
import urlsource from '../source/sources';


function Reference(): JSX.Element {
  const classes = useStyles();

  return (
    <Hidden xsDown>
      <div className={classes.container}>
        <h2 className={classes.title}>온애드에서 광고한 배너입니다</h2>
        <Grid container spacing={2} direction="row" justify="center" alignItems="center">
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
              <img
                src={element.BannerUrl}
                className={classes.image}
                alt="clientImage"
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </Hidden>
  );
}

export default Reference;
