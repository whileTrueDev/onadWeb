import React from 'react';
import style from '../style/Background.style';


function Background(): JSX.Element {
  const classes = style();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.figure1}/>
        <div className={classes.figure2}/>
        <div className={classes.figure3}/>
        <div className={classes.figure4}/>
        <div className={classes.figure5}/>
        <div className={classes.figure6}/>
        <div className={classes.figure7}/>
        <div className={classes.figure8}/>
        <div className={classes.figure9}/>
        <div className={classes.figure10}/>
      </div>
    </div>
  );
}

export default Background