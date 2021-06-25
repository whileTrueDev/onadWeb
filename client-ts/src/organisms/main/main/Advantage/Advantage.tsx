/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { Divider, Typography } from '@material-ui/core';
import classNames from 'classnames';
import shortid from 'shortid';
import styles from '../style/Advantage.style';
import Slider from './sub/index';

interface Props {
  MainUserType: boolean;
  source: any;
}

function Advantage({ source, MainUserType }: Props): JSX.Element {
  const classes = styles();

  const silderProps = {
    zoomFactor: 20,
    slideMargin: 10,
    maxVisibleSlides: 4,
    pageTransition: 500,
  };

  const clickFlag: any = {
    contentWrap0: false,
    contentWrap1: false,
    contentWrap2: false,
    contentWrap3: false,
    contentWrap4: false,
  };

  const [itemClicked, setItemClicked] = useState(clickFlag);

  function flipHandler(e: any) {
    const contentWrap = e.currentTarget as HTMLElement;
    const contentWrapId = contentWrap.id;
    const newItemClicked = { ...itemClicked, [contentWrapId]: !itemClicked[contentWrapId] };

    setItemClicked(newItemClicked);
  }

  return (
    <div className={classes.root}>
      {MainUserType ? (
        <Slider {...silderProps} MainUserType={MainUserType}>
          {source.marketer.map((content: any, i: number) => (
            <div
              className={classes.contentWrapper}
              id={`contentWrap${i}`}
              key={shortid.generate()}
              onClick={e => flipHandler(e)}
            >
              <div
                className={classNames({
                  [classes.figure]: !itemClicked[`contentWrap${i}`],
                  [classes.flipFront]: itemClicked[`contentWrap${i}`],
                })}
              >
                <img src={content.imageUrl} alt="advantage" className={classes.advImg} />
                <Typography variant="h4" className={classes.title}>
                  {content.title}
                </Typography>
                <Typography variant="subtitle2" className={classes.titleBottom}>
                  자세히보기 &gt;
                </Typography>
              </div>
              <div
                className={classNames({
                  [classes.caption]: !itemClicked[`contentWrap${i}`],
                  [classes.flipBack]: itemClicked[`contentWrap${i}`],
                })}
              >
                <Typography variant="h4" className={classes.title}>
                  {content.title}
                </Typography>
                <Divider className={classes.divider} />
                <Typography variant="subtitle1">{content.content}</Typography>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <Slider {...silderProps} MainUserType={MainUserType}>
          {source.creator.map((content: any, i: number) => (
            <div className={classes.contentWrapper} id="contentWrap" key={shortid.generate()}>
              <div
                className={classNames(classes.figure, {
                  [classes.flipFront]: itemClicked[`contentWrap${i}`],
                })}
              >
                <img src={content.imageUrl} alt="advantage" className={classes.advImg} />
                <Typography variant="h4" className={classes.title}>
                  {content.title}
                </Typography>
                <Typography variant="subtitle2" className={classes.titleBottom}>
                  자세히보기 &gt;
                </Typography>
              </div>
              <div
                className={classNames(classes.caption, {
                  [classes.flipBack]: itemClicked[`contentWrap${i}`],
                })}
              >
                <Typography variant="h4" className={classes.title}>
                  {content.title}
                </Typography>
                <Divider className={classes.divider} />
                <Typography variant="subtitle1">{content.content}</Typography>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}

export default Advantage;
