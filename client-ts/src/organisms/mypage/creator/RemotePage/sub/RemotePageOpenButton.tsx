import React from 'react';
import Button from '../../../../../atoms/CustomButtons/Button';
import { REACT_HOST } from '../../../../../config';

const RemotePageOpenButton = (): JSX.Element => {
  const POPUP_WIDTH = process.env.NODE_ENV === 'production' ? 700 : 500;
  const POPUP_HEIGHT = process.env.NODE_ENV === 'production' ? 800 : 700;
  // const POPUP_X = process.env.NODE_ENV === 'production'
  //   ? (window.screen.width / 2) - 450 : (window.screen.width / 2) - 350;
  // const POPUP_Y = process.env.NODE_ENV === 'production'
  //   ? (window.screen.height / 2) - 400 : (window.screen.height / 2) - 350;
  // 개인 리모트 페이지 hash 값 필요
  // remote/{여기 들어가기}
  return (
    <Button
      color="primary"
      onClick={(): void => {
        window.open(`${REACT_HOST}/creator/remote/ketin`,
          '_blank', `width=${POPUP_WIDTH}, height=${POPUP_HEIGHT}, left=${0}, top=${0}, title="온애드 리모컨"`);
      }}
    >
      실시간 제어
    </Button>
  );
};

export default RemotePageOpenButton;
