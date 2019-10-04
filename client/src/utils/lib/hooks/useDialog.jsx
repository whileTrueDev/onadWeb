import React from 'react';

/**
 * @description 다이얼로그 또는 스낵바를 사용하기위한 react hook.
 * 다이얼로그 의 열림 bool값, 열림핸들러, 닫힘핸들러를 반환한다.
 * 다이얼 로그 내부의 값이 가변적이라면, handleOpen의 첫번째 인자로 값을 넘길 수 있다.
 * @returns {object} open, handleOpen, handleClose
 * @author hwasurr
 */
export default function useDialog() {
  const [open, setOpen] = React.useState(false);

  function handleOpen(v = true) {
    setOpen(v);
  }
  function handleClose() {
    setOpen(false);
  }
  return { open, handleOpen, handleClose };
}
