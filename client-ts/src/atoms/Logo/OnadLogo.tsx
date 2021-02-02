import { useTheme } from '@material-ui/core';
import React from 'react';

export interface OnadLogoProps {
  width?: number;
  height?: number;
}
export default function OnadLogo({
  width,
  height,
  ...props
}: OnadLogoProps): JSX.Element {
  const theme = useTheme();
  return (
    <div>
      {theme.palette.type === 'light' ? (
        <img
          src="/pngs/logo/renewal/1x/logo_onad_x.png"
          alt=""
          width={width}
          height={height}
          draggable={false}
          {...props}
        />
      ) : (
        <img
          src="/pngs/logo/renewal/1x/logo_onad_x_w.png"
          alt=""
          width={width}
          height={height}
          draggable={false}
          {...props}
        />
      )}
    </div>
  );
}
