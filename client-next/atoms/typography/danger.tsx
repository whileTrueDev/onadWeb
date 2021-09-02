import * as React from 'react';
import useTypographyStyle from './typography.style';

interface DangerTypographyProps {
  children: React.ReactNode;
}

export default function Danger({ children }: DangerTypographyProps): JSX.Element {
  const classes = useTypographyStyle();
  return <div className={`${classes.defaultFontStyle} ${classes.dangerText}`}>{children}</div>;
}
