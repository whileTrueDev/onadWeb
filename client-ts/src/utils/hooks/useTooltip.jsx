import React from 'react';

export default function useTooltip() {
  const [tooltipIndex, setTooltipIndex] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  function handleTooltipOpen(e, index) {
    setAnchorEl(e.currentTarget);
    setTooltipIndex(index);
  }
  function handleTooltipClose() {
    setAnchorEl(null);
  }
  return {
    tooltipIndex, anchorEl, handleTooltipOpen, handleTooltipClose
  };
}
