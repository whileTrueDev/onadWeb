import React from 'react';

export default function useTooltip(): {
  tooltipIndex: number;
  anchorEl: HTMLElement | null;
  handleTooltipOpen: (
    e: React.MouseEvent<HTMLElement>, index: number) => void;
  handleTooltipClose: () => void;
  } {
  const [tooltipIndex, setTooltipIndex] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  function handleTooltipOpen(
    e: React.MouseEvent<HTMLElement>, index: number
  ): void {
    setAnchorEl(e.currentTarget);
    setTooltipIndex(index);
  }
  function handleTooltipClose(): void {
    setAnchorEl(null);
  }
  return {
    tooltipIndex, anchorEl, handleTooltipOpen, handleTooltipClose
  };
}
