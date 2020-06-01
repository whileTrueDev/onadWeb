import React from 'react';

export default function VideoBanner({
  onError,
  src,
  ...rest
}) {
  return (
    <video {...rest} autoPlay loop onError={onError}>
      <source src={src} type="video/mp4" />
      <track srcLang="ko" kind="captions" />
    </video>
  );
}
