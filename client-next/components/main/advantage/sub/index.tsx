import { useState, useEffect, useRef } from 'react';
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import SliderItem from './sliderItems';
import { StyledSliderWrapper, StyledSlider } from './slider.style';

interface SliderProps {
  children?: any;
  zoomFactor: number;
  slideMargin: number;
  maxVisibleSlides: number;
  pageTransition: number;
  MainUserType: boolean;
}

const numberOfSlides = (maxVisibleSlides: number, windowWidth: number) => {
  if (windowWidth > 1650) return maxVisibleSlides;
  if (windowWidth > 1280) return 3;
  if (windowWidth > 960) return 2;
  if (windowWidth > 600) return 2;
  if (windowWidth > 400) return 2;
  return 1;
};

function Slider({
  children,
  zoomFactor,
  slideMargin,
  maxVisibleSlides,
  pageTransition,
  MainUserType,
}: SliderProps): JSX.Element {
  const [currentPage, setCurrentPage] = useState(0);
  const [transformValue, setTransformValue] = useState(`-${zoomFactor / 2}%`);
  const [scrollSize, setScrollSize] = useState(0);

  const sliderRef = useRef<HTMLElement>(null);

  const visibleSlides = numberOfSlides(maxVisibleSlides, scrollSize);
  const totalPages: number = Math.ceil(children.length / visibleSlides) - 1;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const resizeObserver = new ResizeObserver(entries => {
      setScrollSize(entries[0].contentRect.width);
    });
    if (sliderRef.current) {
      resizeObserver.observe(sliderRef.current);
    }

    const sliderRefCurrent = sliderRef.current;

    return (): void => {
      if (sliderRefCurrent) {
        resizeObserver.unobserve(sliderRefCurrent);
      }
    };
  }, []);

  useEffect(() => {
    if (sliderRef && sliderRef.current) {
      if (currentPage > totalPages) setCurrentPage(totalPages);
      sliderRef.current.style.transform = `translate3D(-${currentPage * scrollSize}px, 0, 0)`;
    }
  }, [sliderRef, currentPage, scrollSize, totalPages]);

  const disableHoverEffect = () => {
    if (sliderRef.current) sliderRef.current.style.pointerEvents = 'none';
    setTimeout(() => {
      if (sliderRef.current) sliderRef.current.style.pointerEvents = 'all';
    }, pageTransition);
  };

  const handleSlideMove = (forward: boolean) => {
    disableHoverEffect();
    setCurrentPage(currentPage + (forward ? 1 : -1));

    if (sliderRef.current) {
      sliderRef.current.style.transform = `translate3D(-${
        (currentPage + (forward ? 1 : -1)) * scrollSize
      }px, 0, 0)`;
    }
  };

  const handleMouseOver = (id: number) => {
    if (id % visibleSlides === 1) setTransformValue('0%');
    if (id % visibleSlides === 0) setTransformValue(`-${zoomFactor}%`);
  };

  const handleMouseOut = () => {
    setTransformValue(`-${zoomFactor / 2}%`);
  };

  const assignSlideClass = (index: number, visibleSlides1: number) => {
    const classes = ['right', 'left'];
    return classes[index % visibleSlides1] || '';
  };

  return (
    <StyledSliderWrapper zoomFactor={zoomFactor} visibleSlides={visibleSlides}>
      <StyledSlider
        visibleSlides={visibleSlides}
        transformValue={transformValue}
        zoomFactor={zoomFactor}
        slideMargin={slideMargin}
        pageTransition={pageTransition}
        ref={sliderRef}
      >
        {children.map((child: any, i: any) => (
          <SliderItem
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            slideMargin={slideMargin}
            visibleSlides={visibleSlides}
            zoomFactor={zoomFactor}
            slideClass={assignSlideClass(i + 1, visibleSlides)}
            id={i + 1}
            callback={handleMouseOver}
            callbackOut={handleMouseOut}
          >
            {child}
          </SliderItem>
        ))}
      </StyledSlider>
      {currentPage > 0 && (
        <div className="button-wrapper backWrapper">
          <button
            type="button"
            className={MainUserType ? 'button back' : 'button2 back'}
            onClick={(): void => handleSlideMove(false)}
          >
            <ArrowLeft className="buttonArrow" />
          </button>
        </div>
      )}
      {currentPage !== totalPages && (
        <div className="button-wrapper forwardWrapper">
          <button
            type="button"
            className={MainUserType ? 'button forward' : 'button2 forward'}
            onClick={(): void => handleSlideMove(true)}
          >
            <ArrowRight className="buttonArrow" />
          </button>
        </div>
      )}
    </StyledSliderWrapper>
  );
}

export default Slider;
