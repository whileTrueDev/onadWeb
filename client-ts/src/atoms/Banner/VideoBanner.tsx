import React from 'react';

interface VideoProps extends React.DetailedHTMLProps<
  React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement> {
  src: string;
  onError?: () => void;
  [key: string]: any;
}
export default function VideoBanner({
  onError,
  src,
  ...rest
}: VideoProps): JSX.Element {
  return (
    <video {...rest} autoPlay loop onError={onError}>
      <source src={src} type="video/mp4" />
      <track srcLang="ko" kind="captions" />
    </video>
  );
}
