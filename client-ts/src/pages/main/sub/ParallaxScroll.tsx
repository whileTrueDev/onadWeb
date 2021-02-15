import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import shortid from 'shortid';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
import Background from './Background';
import style from '../style/ParallaxScroll.style';

interface ParallaxScrollProps {
  children: React.ReactNode[];
  setPsIndex: React.Dispatch<React.SetStateAction<number>>;
  psIndex: number;
  isLogin: boolean;
  loading: boolean | null;
  bgfixedRange: number[];
  timer: NodeJS.Timeout | undefined;
  setTimer: React.Dispatch<React.SetStateAction<NodeJS.Timeout|undefined>>;
  // isDown: boolean;
  // setIsDown: React.Dispatch<React.SetStateAction<boolean>>
  // offsetY: number;
  // setOffsetY: React.Dispatch<React.SetStateAction<number>>
}

function ParallaxScroll({
  children, psIndex,
  setPsIndex, isLogin, loading, bgfixedRange,
  timer, setTimer
  // isDown, setIsDown,
  // offsetY, setOffsetY
}: ParallaxScrollProps): JSX.Element {
  const classes = style();
  const [lastTime, setLastTime] = useState(new Date().getTime());
  // Underscore 함수 - resize 연계, 추후 훅으로 만들것 => lodash도 만들것

  useEffect(() => {
    const slideSection = document.querySelectorAll<HTMLElement>('#slideContent');
    const slideController = document.querySelectorAll<HTMLElement>('#slideController');
    const parallaxWapper = document.getElementById('parallax');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');

    function handleHeight() {
      if (timer) {
        clearTimeout(timer);
      }
      const newTimer = setTimeout(() => {
        window.location.reload();
      }, 300);
      setTimer(newTimer);
    }

    window.addEventListener('resize', handleHeight);

    // 변수 설정 및 초깃값
    // let moveY = 0
    // const POINTEREVENTDURATION = 500
    const ANIMARIONDURATION = 1000;
    const finalSlideNum = slideSection.length;
    const CONTROLLERCOLOR = '#826AEF';
    slideController[psIndex].style.backgroundColor = CONTROLLERCOLOR;

    function nextMove(e: MouseEvent) {
      e.preventDefault();
      if (psIndex > finalSlideNum - 2) return;
      slideSection[psIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
      setPsIndex(psIndex + 1);
    }

    function prevMove(e: MouseEvent) {
      e.preventDefault();
      if (psIndex < 1) return;
      slideSection[psIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
      setPsIndex(psIndex - 1);
    }

      nextBtn?.addEventListener('click', nextMove);
      prevBtn?.addEventListener('click', prevMove);

      // 클릭한 컨트롤러의 해당 slide로 이동
      slideController.forEach((point, i) => {
        point.addEventListener('click', () => {
          slideSection[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
          setPsIndex(i);
        });
      });

      // 마우스 휠 핸들러 함수
      function wheelHandler(e: WheelEvent): void {
        e.preventDefault();
        const nowTime = new Date().getTime();

        if (nowTime - lastTime < ANIMARIONDURATION) {
          return;
        }
        const delta = e.deltaY;

        if (delta > 0) {
          // slide 클릭 이벤트 전파
          const nextBtnClick = new Event('click');
          if (psIndex > finalSlideNum - 2) return;
          slideController[psIndex + 1]?.dispatchEvent(nextBtnClick);
        } else {
          // slide 클릭 이벤트 전파
          const prevBtnClick = new Event('click');
          if (psIndex < 1) return;
          slideController[psIndex - 1]?.dispatchEvent(prevBtnClick);
        }
        setLastTime(new Date().getTime());
      }

      // 마우스 휠 전환 효과 탑재
      parallaxWapper?.addEventListener('wheel', wheelHandler, { passive: false });

      const inquiry = document.getElementById('inquiry');

      // 문의하기 클릭시 상위 휠 이벤트 제거
      inquiry?.addEventListener('click', () => {
        parallaxWapper?.removeEventListener('wheel', wheelHandler);
      });

      // 문의하기 비활성화시 상위 휠 이벤트 재생성
      slideSection[5].addEventListener('mouseover', (e) => {
        e.preventDefault();
        parallaxWapper?.addEventListener('wheel', wheelHandler, { passive: false });
      });

      // function onDown(e: PointerEvent) {
      //   moveY = 0
      //   setOffsetY(e.clientY)
      //   setIsDown(true)
      // }
      // 
      // function onMove(e: PointerEvent) {
      //   // e.preventDefault()
      //   if (isDown) {
      //     moveY = e.clientY- offsetY
      //     const nowTime = new Date().getTime()
      //     if (nowTime - lastTime < POINTEREVENTDURATION) {
      //       return;
      //     }
      //     if (moveY < 0) {
      //       const nextBtnClick = new Event('click');
      //       if (psIndex > finalSlideNum - 2) return;
      //       slideController[psIndex+1]?.dispatchEvent(nextBtnClick)
      //       // if (psIndex > finalSlideNum - 2) return;
      //       // slideSection[psIndex+1].scrollIntoView({behavior: 'smooth', block: 'start'});
      //       // setPsIndex(psIndex+1)
      //     } else {
      //       // if (psIndex < 1) return;
      //       // slideSection[psIndex].scrollIntoView({behavior: 'smooth', block: 'start'});
      //       // setPsIndex(psIndex-1)
      //       const prevBtnClick = new Event('click');
      //       if (psIndex < 1) return;
      //       slideController[psIndex-1]?.dispatchEvent(prevBtnClick)
      //     }
      //     setLastTime(new Date().getTime())
      //   }
      // }

      // parallaxWapper?.addEventListener('pointerdown', onDown);
      // parallaxWapper?.addEventListener('pointermove', onMove);

      return () => {
        // UnMount시 휠, 포인터 이벤트 제거
        parallaxWapper?.removeEventListener('wheel', wheelHandler);
        nextBtn?.removeEventListener('click', nextMove);
        prevBtn?.removeEventListener('click', prevMove);
        // parallaxWapper?.removeEventListener('pointerdown', onDown);
        // parallaxWapper?.removeEventListener('pointermove', onMove);
        // window.removeEventListener('resize', handleHeight)
      };
  }, [psIndex, isLogin, lastTime, loading, setPsIndex, timer, setTimer]);

  return (
    <main className={classes.container} id="parallax">
      { (bgfixedRange[1] >= psIndex) ? (
        <Background />
      ) : (
        null
      )}
      <div>
        {children.map((component, index) => (
          <div key={shortid.generate()} className={classes.slide} id="slideContent" data-slideindex={index}>
            {component}
          </div>
        ))}
      </div>

      <div className={classes.slideController}>
        {children.map((num, index) => (
          <div key={shortid.generate()} className={classes.slideNum} id="slideController" data-controllernum={index} />
        ))}
      </div>

      <div id="prev" className={classnames(classes.naviIcon, classes.prev)}>
        <ArrowUpwardOutlinedIcon />
      </div>
      <div id="next" className={classnames(classes.naviIcon, classes.next)}>
        <ArrowDownwardOutlinedIcon />
      </div>
    </main>
  );
}

export default ParallaxScroll;
