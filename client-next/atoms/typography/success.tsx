import * as React from 'react';
import useTypographyStyle from './typography.style';

interface SuccessTypographyProps {
  children: React.ReactNode;
}

export default function Success({ children }: SuccessTypographyProps): JSX.Element {
  const classes = useTypographyStyle();
  return <div className={`${classes.defaultFontStyle} ${classes.successText}`}>{children}</div>;
}
