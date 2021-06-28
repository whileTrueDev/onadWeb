import * as React from 'react';

/**
 * anchor Element를 사용할 수 있도록 도와주는 hook
 * Popper, Popover등 어떤 html엘리먼트에 종속되는 (위치가 지정되어야 하는 컴포넌트의 경우) 이 훅을 통해 anchorEl을 설정 및 사용할 수 있다.
 * open 값, anchor HTML엘리먼트, 해당엘리먼트를 anchorEl로 설정하는 핸들러, anchorEl 삭제 핸들러를 반환한다.
 * 두 핸들링 함수는 onClick이벤트, onMouseEnter, onMouseLeave 등에 적용할 수 있다.
 * @example
 * const { open, anchorEl, handleAnchorOpen, handleAnchorClose } = useAnchorEl();
 * return (
 *   <React.Fragment>
 *     <div
 *       onMouseEnter={handleAnchorOpen}
 *       onMouseLeave={handleAnchorClose}
 *     >
 *       Hover width a Popper
 *     </div>
 *     <Popper open={open} anchorEl={anchorEl}></Popper>
 *   </React.Fragment>
 * )
 * @returns {object} {open, anchorEl, handleClick, handleCLose}
 * @author hwasurr
 */
export default function useAnchorEl(): {
  open: boolean;
  anchorEl: HTMLElement | null;
  handleAnchorOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleAnchorOpenWithRef: (ref: React.MutableRefObject<HTMLButtonElement | null>) => void;
  handleAnchorClose: () => void;
} {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleAnchorOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleAnchorOpenWithRef = (ref: React.MutableRefObject<HTMLButtonElement | null>): void => {
    setAnchorEl(ref.current);
  };

  const handleAnchorClose = (): void => {
    setAnchorEl(null);
  };
  return {
    open,
    anchorEl,
    handleAnchorOpen,
    handleAnchorOpenWithRef,
    handleAnchorClose,
  };
}
