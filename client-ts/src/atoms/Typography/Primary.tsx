import React from 'react';
import useTypographyStyle from './Typography.style';

interface PrimaryTypographyProps {
  children: React.ReactNode;
}

export default function Primary({ children }: PrimaryTypographyProps): JSX.Element {
  const classes = useTypographyStyle();
  return <div className={`${classes.defaultFontStyle} ${classes.primaryText}`}>{children}</div>;
}
