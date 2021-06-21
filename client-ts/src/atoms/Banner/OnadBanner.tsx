import { ButtonBase } from '@material-ui/core';
import React from 'react';
import isVideo from '../../utils/isVideo';

export interface OnadBannerProps {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLElement>) => void;
  [key: string]: any;
}

export default function OnadBanner({
  src,
  alt = '',
  width = 320,
  height = 160,
  onClick,
  onError,
  ...rest
}: OnadBannerProps): JSX.Element {
  if (isVideo(src)) {
    if (onClick) {
      return (
        <ButtonBase onClick={onClick}>
          <video
            draggable={false}
            autoPlay
            loop
            muted
            onError={onError}
            width={width}
            height={height}
            {...rest}
          >
            <source src={src} type="video/mp4" />
            <track srcLang="ko" kind="captions" />
          </video>
        </ButtonBase>
      );
    }
    return (
      <video
        draggable={false}
        autoPlay
        loop
        muted
        onError={onError}
        width={width}
        height={height}
        {...rest}
      >
        <source src={src} type="video/mp4" />
        <track srcLang="ko" kind="captions" />
      </video>
    );
  }

  if (onClick) {
    return (
      <ButtonBase onClick={onClick}>
        <img draggable={false} src={src} alt={alt} width={width} height={height} {...rest} />
      </ButtonBase>
    );
  }

  return <img draggable={false} src={src} alt={alt} width={width} height={height} {...rest} />;
}
