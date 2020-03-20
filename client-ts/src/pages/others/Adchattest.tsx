import React from 'react';

export default function Adchattest(): JSX.Element {
  return (
    <div>
      ㄱ ㄱ
      <button
        type="button"
        onClick={(): void => {
          document.location.href = 'http://localhost:3001/adchat/iamsupermazinga';
        }}
      >
        ㄲㄲ 채팅 트래커로 이동하기

      </button>
    </div>
  );
}
