import React from 'react';
import Slider, { SliderProps } from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';

interface ValueLabelComponentProps {
  children: React.ReactElement;
  open: boolean;
  value: number;
}
function ValueLabelComponent(props: ValueLabelComponentProps): JSX.Element {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

export default function AdLevelSlider(props: SliderProps): JSX.Element {
  return (
    <Slider ValueLabelComponent={ValueLabelComponent} aria-label="custom thumb label" {...props} />
  );
}
