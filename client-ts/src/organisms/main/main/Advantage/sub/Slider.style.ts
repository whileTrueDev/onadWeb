import styled from 'styled-components';
import StyledSliderItem from './SliderItems.style';

type SliderWrapperProps = {
  zoomFactor: number;
  visibleSlides: number;
};

type SliderProps = {
  visibleSlides: number;
  transformValue: string;
  zoomFactor: number;
  slideMargin: number;
  pageTransition: number;
  ref: any;
};

export const StyledSliderWrapper = styled.div<SliderWrapperProps>`
  overflow: hidden;
  position: relative;
  padding: ${(props) => `${(props.zoomFactor / props.visibleSlides) * 1}%`} 0;
  .button-wrapper {
    position: absolute;
    width: 30px;
    height: 30px;
    bottom: 20px;
    box-sizing: border-box;
  }
  .button {
    background-color: white;
    display: block;
    border: 2px solid #009efd;
    width: 30px;
    height: 30px;
    color: #009efd;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.7s;
    user-select: none;
    :hover {
      opacity: 0.5;
    }
  }
  .button2 {
    background-color: white;
    display: block;
    border: 2px solid #00d1c9;
    width: 30px;
    height: 30px;
    color: #00d1c9;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.7s;
    user-select: none;
    :hover {
      opacity: 0.5;
    }
  }
  .backWrapper {
    left: 50%;
    bottom: 20px;
    transform: translate(100%, 0);
  }
  .forwardWrapper {
    left: 50%;
    transform: translate(-100%, 0);
    bottom: 20px;
  }
  .back {
    border-radius: 50%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: relative;
  }
  .forward {
    border-radius: 50%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: relative;
  }
  .buttonArrow {
    position: absolute;
    font-size: 40px;
    margin: 0;
    top: -18px;
  }
`;

export const StyledSlider = styled.div<SliderProps>`
  display: flex;
  padding: 0 40px;
  transition: transform ${(props) => props.pageTransition}ms ease;
  :hover ${StyledSliderItem} {
    transform: translateX(${(props) => props.transformValue});
  }
`;
