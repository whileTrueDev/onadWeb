// material-UI
import { useTheme } from '@material-ui/core';
// 내부 소스
import onadLogo_x from '../../public/logo/renewal/logo_onad_x.png'
import onadLogo_x_w from '../../public/logo/renewal/logo_onad_x_w.png'
// 프로젝트 내부 모듈
import Image from 'next/image'

export interface OnadLogoProps {
  width?: number;
  height?: number;
}
export default function OnadLogo({ width, height, ...props }: OnadLogoProps): JSX.Element {
  const theme = useTheme();
  return (
    <div>
      {theme.palette.type === 'light' ? (
        <Image
          src={onadLogo_x}
          alt="onadLogo"
          width={width}
          height={height}
          draggable={false}
          {...props}
        />
      ) : (
        <Image
          src={onadLogo_x_w}
          alt="onadLogo"
          width={width}
          height={height}
          draggable={false}
          {...props}
        />
      )}
    </div>
  );
}
