
import styles from '../style/Advantage.style';
import React, {useEffect} from 'react';
import { Divider, Typography } from '@material-ui/core';
import classNames from 'classnames'
import shortid from 'shortid';
import Slider from './sub/index'



interface Props {
  MainUserType: boolean;
  source: any;
}

function Advantage({ source, MainUserType}: Props): JSX.Element {
  const classes = styles();

  const silderProps = {
    zoomFactor: 20,
    slideMargin: 10,
    maxVisibleSlides: 4,
    pageTransition: 500,
  }
  
  useEffect(() => {
    const slides = document.querySelectorAll<HTMLElement>('#contentWrap')
    const fronts = document.querySelectorAll<HTMLElement>('#front')
    const backs = document.querySelectorAll<HTMLElement>('#back')

    slides.forEach((slide, i) => {
      slide.addEventListener('click', () => {
        fronts[i].style.transform = 'rotateY(-180deg)'
        fronts[i].style.zIndex = '100'
        fronts[i].style.transition = 'all 0.6s ease-in-out'
        backs[i].style.transform = 'rotateY(0deg)'
        backs[i].style.zIndex = '200'
        backs[i].style.transition = 'all 0.6s ease-in-out'
      })
    })
  }, [])
  

  return (
    <div className={classes.root}>
      {MainUserType ? (
          <Slider {...silderProps} MainUserType={MainUserType}>
            {source.marketer.map((content:any,) => (
                <div className={classes.contentWrapper} id="contentWrap" key={shortid.generate()}>
                  <div className={classNames(classes.figure, classes.face)} id="front">
                    <img src={content.imageUrl} alt="advantage" className={classes.advImg} />
                    <Typography variant="h4" className={classes.title}>{content.title}</Typography>
                    <Typography variant="subtitle2" className={classes.titleBottom}>자세히보기 &gt;</Typography>
                  </div>
                  <div className={classNames(classes.caption, classes.face)} id="back">
                    <Typography variant="h4" className={classes.title}>{content.title}</Typography>
                    <Divider className={classes.divider}/>
                    <Typography variant="subtitle1">{content.content}</Typography>
                  </div>
                </div>
              ))}
          </Slider>
      )
        : (
          <Slider {...silderProps} MainUserType={MainUserType}>
          {source.creator.map((content:any,) => (
              <div className={classes.contentWrapper} id="contentWrap" key={shortid.generate()}>
                <div className={classNames(classes.figure, classes.face)} id="front">
                  <img src={content.imageUrl} alt="advantage" className={classes.advImg} />
                  <Typography variant="h4" className={classes.title}>{content.title}</Typography>
                  <Typography variant="subtitle2" className={classes.titleBottom}>자세히보기 &gt;</Typography>
                </div>
                <div className={classNames(classes.caption, classes.face)} id="back">
                  <Typography variant="h4" className={classes.title}>{content.title}</Typography>
                  <Divider className={classes.divider}/>
                  <Typography variant="subtitle1">{content.content}</Typography>
                </div>
              </div>
            ))}
        </Slider>)
      }
    </div>
  );
}

export default Advantage;
