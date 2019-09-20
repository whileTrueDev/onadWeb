import React from 'react';

/**
 * @description 다이얼로그 또는 스낵바를 사용하기위한 react hook. 다이얼로그 의 열림 bool값, 열림핸들러, 닫힘핸들러를 반환한다.
 * @returns {object} open, handleOpen, handleClose
 * @author hwasurr
 */
export default function useDialog() {
  const [open, setOpen] = React.useState(false);

  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }
  return { open, handleOpen, handleClose };
}
