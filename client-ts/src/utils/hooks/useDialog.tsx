import React from 'react';

/**
 * Boolean state와 핸들러를 반환하는 react hook.  
 * 다이얼 로그 또는 스낵바를 사용할 때 쓸 수 있다.  
 * 다이얼 로그 의 열림 bool값, 열림핸들러, 닫힘핸들러를 반환한다.  
 * 다이얼 로그 내부의 값이 가변적이라면, handleOpen의 첫번째 인자로 값을 넘길 수 있다.
 * @returns {object} open, handleOpen, handleClose
 * @author hwasurr
 */
export default function useDialog(): {
  open: boolean;
  handleOpen: (v?: boolean) => void;
  handleClose: () => void;
  } {
  const [open, setOpen] = React.useState(false);

  function handleOpen(v = true): void {
    setOpen(v);
  }
  function handleClose(): void {
    setOpen(false);
  }
  return { open, handleOpen, handleClose };
}
