import React from 'react';
import { StyledSliderItem } from './SliderItems.style';

interface SliderItemProps {
  slideClass: string;
  zoomFactor: number
  id: number
  callback: (id: number) => void;
  callbackOut: () => void;
  slideMargin: number;
  visibleSlides: number;
  children: React.ReactNode
};

function SliderItem({
  children,
  slideClass,
  zoomFactor,
  id,
  callback,
  callbackOut,
  slideMargin,
  visibleSlides
}: SliderItemProps): JSX.Element {
  return(
    <StyledSliderItem
      zoomFactor={zoomFactor}
      slideMargin={slideMargin}
      visibleSlides={visibleSlides}
      className={slideClass}
      onMouseOver={() => callback(id)}
      onMouseOut={callbackOut}
    >
        {children}
    </StyledSliderItem>
  )
}

export default SliderItem;