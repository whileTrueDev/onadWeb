/* eslint-disable no-unused-expressions */
// material-UI
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
// 내부 소스
// 프로젝트 내부 모듈
import { useEffect, useState } from 'react';
import * as React from 'react';
import classnames from 'classnames';
import { nanoid } from 'nanoid';
// 컴포넌트
import Background from './background';
// util 계열
// 스타일
import style from '../../styles/main/parallaxScroll.style';

interface ParallaxScrollProps {
  children: React.ReactNode[];
  setPsIndex: React.Dispatch<React.SetStateAction<number>>;
  psIndex: number;
  isLogin: boolean;
  bgfixedRange: number[];
  renewalDialog: boolean;
}

function ParallaxScroll({
  children,
  psIndex,
  setPsIndex,
  isLogin,
  bgfixedRange,
  renewalDialog,
}: ParallaxScrollProps): JSX.Element {
  const classes = style();
  const [lastTime, setLastTime] = useState(new Date().getTime());

  useEffect(() => {
    const slideSection = document.querySelectorAll<HTMLElement>('#slideContent');
    const slideController = document.querySelectorAll<HTMLElement>('#slideController');
    const parallaxWapper = document.getElementById('parallax');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');

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
    slideSection[5].addEventListener('mouseover', e => {
      e.preventDefault();
      parallaxWapper?.addEventListener('wheel', wheelHandler, { passive: false });
    });

    return () => {
      // UnMount시 휠, 포인터 이벤트 제거
      parallaxWapper?.removeEventListener('wheel', wheelHandler);
      nextBtn?.removeEventListener('click', nextMove);
      prevBtn?.removeEventListener('click', prevMove);
    };
  }, [psIndex, isLogin, lastTime, setPsIndex, renewalDialog]);

  return (
    <main className={classes.container} id="parallax">
      {bgfixedRange[1] >= psIndex ? <Background /> : null}
      <div>
        {children.map((component, index) => (
          <div key={nanoid()} className={classes.slide} id="slideContent" data-slideindex={index}>
            {component}
          </div>
        ))}
      </div>

      <div className={classes.slideController}>
        {children.map((num, index) => (
          <div
            key={nanoid()}
            className={classes.slideNum}
            id="slideController"
            data-controllernum={index}
          />
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
