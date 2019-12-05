import React, { useState, useEffect, useCallback, useReducer } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import './MainCarousel.scss';
import HOST from '../../../../../utils/config';
import axios from '../../../../../utils/axios';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(12),
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
  },
}));

const autoReducer = (state, action) => {
  switch (action.key) {
    case 'zero' : {
      return { ...state, auto0: true, auto1: false, auto9: false }
    }
    case 'one' : {
      return { ...state, auto1: true, auto2: false, auto0: false }
    }
    case 'two' : {
      return { ...state, auto2: true, auto3: false, auto1: false }
    }
    case 'three' : {
      return { ...state, auto3: true, auto4: false, auto2: false }
    }
    case 'four' : {
      return { ...state, auto4: true, auto5: false, auto3: false }
    }
    case 'five' : {
      return { ...state, auto5: true, auto6: false, auto4: false }
    }
    case 'six' : {
      return { ...state, auto6: true, auto7: false, auto5: false }
    }
    case 'seven' : {
      return { ...state, auto7: true, auto8: false, auto6: false}
    }
    case 'eight' : {
      return { ...state, auto8: true, auto9: false, auto7: false }
    }
    case 'nine' : {
      return { ...state, auto9: true, auto0: false, auto8: false }
    }
    default: {
      return state
    }
  }
}

const initialState = {
  auto0:true,
  auto1:false,
  auto2:false,
  auto3:false,
  auto4:false,
  auto5:false,
  auto6:false,
  auto7:false,
  auto8:false,
  auto9:false,
}

const MainCarousel = () => {
  const classes = useStyles();
  const [creator, setCreator] = useState({})
  const [loading, setLoading] = useState(true)
  const [autoState, autoDispatch ] = useReducer(autoReducer, initialState )
  const {auto0, auto1, auto2, auto3, auto4, auto5, auto6, auto7, auto8, auto9} = autoState 
  
  const readyCreatorData = useCallback(() => {
    axios.get(`${HOST}/api/streams`).then((res) => {
      if (res.data) {
        setCreator(res.data)
        console.log(res.data.length);
        if (res.data.length === 0) {
          setLoading(false);
        } else {
          getHTMLElement();
          setTimeout(function() {
            document.getElementsByClassName('after-fetch')[0].style.visibility = 'visible'
            document.getElementsByClassName('before-carousel')[0].classList.add('stayEndCaoursel')
            document.getElementsByClassName('after-fetch')[0].classList.add('stayEndTitle')
            document.getElementsByClassName('before-carousel')[0].style.animation = `none !important`
            document.getElementsByClassName('after-fetch')[0].style.animation = `none !important`
          }, 2700)
        }
        
      } else {
        alert('OnAD 홈페이지 방문을 환영합니다!')
      }
    })
  }, [])

  // 3D carousel 구현
  function getHTMLElement() {
    let	carousels = document.querySelector('.carousel');
    carousel(carousels);
  }
    
  function carousel(root) {

    let
      figure = root.querySelector('figure'),
      videos = figure.children,
      n = videos.length,
      gap = root.dataset.gap || 0,
      theta =  2 * Math.PI / n,
      currVideo = 800;
      
    setupCarousel(n, parseFloat(getComputedStyle(videos[1]).width));
    
    window.addEventListener('resize', () => { 
      setupCarousel(n, parseFloat(getComputedStyle(videos[1]).width)) 
    });

    setupNavigation();

    function setupCarousel(n, s) {
      let	
        apothem = s / (2 * Math.tan(Math.PI / n))
      ;
      
      figure.style.transformOrigin = `50% 50% ${- apothem}px`;

      for (let i = 0; i < n; i++)
        videos[i].style.padding = `${gap}px`;
      for (let i = 0; i < n; i++) {
        videos[i].style.transformOrigin = `50% 50% ${- apothem}px`;
        videos[i].style.transform = `rotateY(${i * theta}rad)`;
      }
      
      for (let i = 0; i < n; i++)
      videos[i].style.backfaceVisibility = 'hidden';
    
        
      rotateCarousel(currVideo);
    }

    function setupNavigation() {
      document.getElementById('prev').addEventListener('click', onClickPrev, true);
      document.getElementById('next').addEventListener('click', onClickNext, true);
      
      function onClickPrev() {
        currVideo++;
        rotateCarousel(currVideo);
        switch ((Math.abs(currVideo)%n).toString()) {
          case '0' : {
            return autoDispatch({ key: 'zero'})
          }
          case '1' : {
            return autoDispatch({ key: 'one'})
          }
          case '2' : {
            return autoDispatch({ key: 'two'})
          }
          case '3' : {
            return autoDispatch({ key: 'three'})
          }
          case '4' : {
            return autoDispatch({ key: 'four'})
          }
          case '5' : {
            return autoDispatch({ key: 'five'})
          }
          case '6' : {
            return autoDispatch({ key: 'six'})
          }
          case '7' : {
            return autoDispatch({ key: 'seven'})
          }
          case '8' : {
            return autoDispatch({ key: 'eight'})
          }
          case '9' : {
            return autoDispatch({ key: 'nine'})
          }
          default: {
            return autoDispatch({ key: 'zero'})
          }
        }
      }

      function onClickNext() {
        currVideo--;
        rotateCarousel(currVideo);
        switch ((Math.abs(currVideo)%n).toString()) {
          case '0' : {
            return autoDispatch({ key: 'zero'})
          }
          case '1' : {
            return autoDispatch({ key: 'one'})
          }
          case '2' : {
            return autoDispatch({ key: 'two'})
          }
          case '3' : {
            return autoDispatch({ key: 'three'})
          }
          case '4' : {
            return autoDispatch({ key: 'four'})
          }
          case '5' : {
            return autoDispatch({ key: 'five'})
          }
          case '6' : {
            return autoDispatch({ key: 'six'})
          }
          case '7' : {
            return autoDispatch({ key: 'seven'})
          }
          case '8' : {
            return autoDispatch({ key: 'eight'})
          }
          case '9' : {
            return autoDispatch({ key: 'nine'})
          }
          default: {
            return autoDispatch({ key: 'zero'})
          }
        }
      } 
    }

    function rotateCarousel(videoIndex) {
      figure.style.transform = `rotateY(${videoIndex * -theta}rad)`;
    }
  }

  useEffect(() => {
    readyCreatorData();
  }, [readyCreatorData]);

  return (
    <>
    {loading? (
        <section className={classes.container}>
          
          <div className="before-carousel">
            <div className="after-fetch" >
            <div className="carousel" data-gap="20">
              <nav>
                <div className="prev" id="prev">
                  <svg width="100%" height="100%" viewBox="0 0 20 20" x="0px" y="0px">
                    <path d="M13.5 14.5L9 10l4.5-4.5L12 4l-6 6 6 6 1.5-1.5z"></path>
                  </svg>
                </div>
              </nav>
              
              <figure>
                  <iframe
                    title="hero"
                    src={`https://player.twitch.tv/?channel=${creator[0]}&autoplay=${auto0}`}
                    height="300"
                    width="450"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                  />
                  <iframe
                    title="hero"
                    src={`https://player.twitch.tv/?channel=${creator[1]}&autoplay=${auto1}`}
                    height="300"
                    width="450"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                  />
                  <iframe
                    title="hero"
                    src={`https://player.twitch.tv/?channel=${creator[2]}&autoplay=${auto2}`}
                    height="300"
                    width="450"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                  />
                  <iframe
                    title="hero"
                    src={`https://player.twitch.tv/?channel=${creator[3]}&autoplay=${auto3}`}
                    height="300"
                    width="450"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                  />
                  <iframe
                    title="hero"
                    src={`https://player.twitch.tv/?channel=${creator[4]}&autoplay=${auto4}`}
                    height="300"
                    width="450"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                  />
                  <iframe
                    title="hero"
                    src={`https://player.twitch.tv/?channel=${creator[5]}&autoplay=${auto5}`}
                    height="300"
                    width="450"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                  />
                  <iframe
                    title="hero"
                    src={`https://player.twitch.tv/?channel=${creator[6]}&autoplay=${auto6}`}
                    height="300"
                    width="450"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                  />
                  <iframe
                    title="hero"
                    src={`https://player.twitch.tv/?channel=${creator[7]}&autoplay=${auto7}`}
                    height="300"
                    width="450"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                  />
                  <iframe
                    title="hero"
                    src={`https://player.twitch.tv/?channel=${creator[8]}&autoplay=${auto8}`}
                    height="300"
                    width="450"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                  />
                  <iframe
                    title="hero"
                    src={`https://player.twitch.tv/?channel=${creator[9]}&autoplay=${auto9}`}
                    height="300"
                    width="450"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                  />
                </figure>
                <nav>
                  <div className="next" id="next">
                      <svg width="100%" height="100%" viewBox="0 0 20 20" x="0px" y="0px">
                        <path d="M6.5 5.5L11 10l-4.5 4.5L8 16l6-6-6-6-1.5 1.5z"></path>
                      </svg>
                  </div>
                </nav>
            
            </div>
            </div>
          </div>
          <h1 className="nowCreatorTitle">OnAD와 함께하는 크리에이터입니다</h1>
          
        </section>)
      
      : (null) }
    </>
  );
};

export default MainCarousel;