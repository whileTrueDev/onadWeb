import React from 'react';

export default function copyToClipboard(
  e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>,
  elementId: string,
  callback?: () => void,
): void {
  e.preventDefault();
  const overlayUrl = document.getElementById(elementId) as HTMLInputElement;
  if (overlayUrl) {
    overlayUrl.select();
    document.execCommand('copy');

    // 스낵바 오픈
    if (callback) callback();
  } else {
    throw Error(`Element not exists id: ${elementId}`);
  }
}
