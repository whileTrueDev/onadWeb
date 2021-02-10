import React, {useEffect, useState} from 'react';
import style from '../style/ParallaxScroll.style';
import shortid from 'shortid'
import Background from './Background'

interface ParallaxScrollProps {
  children: React.ReactNode[];
  setPsIndex: React.Dispatch<React.SetStateAction<number>>
  psIndex: number;
  isLogin: boolean;
  loading: boolean | null;
  bgfixedRange: number[]
}

function ParallaxScroll({ children, psIndex, setPsIndex, isLogin, loading, bgfixedRange }: ParallaxScrollProps): JSX.Element {
    const classes = style();
    const [lastTime, setLastTime] = useState(new Date().getTime());

    useEffect(() => {
      const slideSection = document.querySelectorAll<HTMLElement>('#slideContent')
      const slideController = document.querySelectorAll<HTMLElement>('#slideController')
      const parallaxWapper = document.getElementById('parallax')

      // 변수 설정 및 초깃값å
      const ANIMARIONDURATION = 1000
      const finalSlideNum = slideSection.length
      const CONTROLLERCOLOR = '#826AEF'
      const CONTROLLERSCALE = 'scale(1.4)'
      slideController[psIndex].style.backgroundColor = CONTROLLERCOLOR
      slideController[psIndex].style.transform = CONTROLLERSCALE;
  
      // 클릭한 컨트롤러의 해당 slide로 이동
      slideController.forEach((point, i) => {
        point.addEventListener('click', () => {
          slideSection[i].scrollIntoView({behavior: 'smooth', block: 'start'});
          setPsIndex(i)
        })
      })

      // 마우스 휠 핸들러 함수
      function wheelHandler(e: WheelEvent): void {
        e.preventDefault()
        const nowTime = new Date().getTime()

        if (nowTime - lastTime < ANIMARIONDURATION) {
          return;
        }
        const delta = e.deltaY;

        if (delta > 0) {
          // slide 클릭 이벤트 전파
          const nextBtnClick = new Event('click');
          if (psIndex > finalSlideNum - 2) return;
          slideController[psIndex+1]?.dispatchEvent(nextBtnClick)
        } else {
          // slide 클릭 이벤트 전파
          const prevBtnClick = new Event('click');
          if (psIndex < 1) return;
          slideController[psIndex-1]?.dispatchEvent(prevBtnClick)
        }
        setLastTime(new Date().getTime())
      }

      // 마우스 휠 전환 효과 탑재
      parallaxWapper?.addEventListener('wheel', wheelHandler, {passive: false})

      const inquiry = document.getElementById('inquiry')

      // 문의하기 클릭시 상위 휠 이벤트 제거
      inquiry?.addEventListener('click', () => {
        parallaxWapper?.removeEventListener('wheel', wheelHandler)
      })

      // 문의하기 비활성화시 상위 휠 이벤트 재생성
      slideSection[5].addEventListener('mouseover', (e) => {
        e.preventDefault();
        parallaxWapper?.addEventListener('wheel', wheelHandler, {passive: false})
      })

      return () => {
        //UnMount시 휠 이벤트 제거
        parallaxWapper?.removeEventListener('wheel', wheelHandler)
      }
  
    }, [psIndex, isLogin, lastTime, loading, setPsIndex])

  return (
    <main className={classes.container} id="parallax">
        { (bgfixedRange[1] >= psIndex) ? (
          <Background />
        ) : (
          null
        )}
        <div>
          {children.map( (component, index) => (
            <div key={shortid.generate()} className={classes.slide} id="slideContent" data-slideindex={index}>
              {component}
            </div>
          ))}
        </div>
        
        <div className={classes.slideController}>
          {children.map( (num, index) => (
            <div key={shortid.generate()} className={classes.slideNum} id="slideController" data-controllernum={index} />
          ))}
        </div>

        <div id="prev" className={classes.prev}/>
        <div id="next" className={classes.next}/>
    </main>
  );
}

export default ParallaxScroll