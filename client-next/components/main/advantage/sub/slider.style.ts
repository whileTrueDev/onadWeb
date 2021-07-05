import styled from 'styled-components';
import StyledSliderItem from './sliderItems.style';

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
  padding: ${props => `${(props.zoomFactor / props.visibleSlides) * 1}%`} 0;
  .button-wrapper {
    position: absolute;
    width: 30px;
    height: 30px;
    bottom: 20px;
    box-sizing: border-box;
  }
  .button {
    background-color: white;
    margin: 0px;
    padding: 0px;
    display: block;
    width: 30px;
    height: 30px;
    border: 2px solid #009efd;
    color: #009efd;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.7s;
    user-select: none;
    border-radius: 50%;
    :hover {
      opacity: 0.5;
    }
  }
  .button2 {
    background-color: white;
    display: block;
    width: 30px;
    height: 30px;
    border: 2px solid #00d1c9;
    color: #00d1c9;
    border-radius: 50%;
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
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: relative;
  }
  .forward {
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: relative;
  }
  .buttonArrow {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 26px;
    height: 26px;
  }
`;

export const StyledSlider = styled.div<SliderProps>`
  display: flex;
  padding: 0 60px;
  transition: transform ${props => props.pageTransition}ms ease;
  :hover ${StyledSliderItem} {
    transform: translateX(${props => props.transformValue});
  }
`;
