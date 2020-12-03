import React from 'react';
import Button from '../../../../../atoms/CustomButtons/Button';
import { REACT_HOST } from '../../../../../config';
import useGetRequest from '../../../../../utils/hooks/useGetRequest';

const RemotePageOpenButton = (): JSX.Element => {
  const POPUP_WIDTH = process.env.NODE_ENV === 'production' ? 900 : 900;
  const POPUP_HEIGHT = process.env.NODE_ENV === 'production' ? 800 : 700;
  const remoteControllerUrl = useGetRequest<null, string>('/creator/banner/remote-page-url');

  // 개인 리모트 페이지 hash 값 필요
  // remote/{여기 들어가기}
  return (
    <Button
      color="primary"
      onClick={(): void => {
        window.open(`${REACT_HOST}/creator/remote/${remoteControllerUrl.data}`,
          '_blank', `width=${POPUP_WIDTH}, height=${POPUP_HEIGHT}, left=${0}, top=${0}, title="온애드 리모컨"`);
      }}
    >
      실시간 제어
    </Button>
  );
};

export default RemotePageOpenButton;
