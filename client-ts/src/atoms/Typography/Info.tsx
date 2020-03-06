import React from 'react';
import useTypographyStyle from './Typography.style';

interface InfoTypographyProps {children: React.ReactNode}

export default function Info({ children }: InfoTypographyProps): JSX.Element {
  const classes = useTypographyStyle();
  return (
    <div className={`${classes.defaultFontStyle} ${classes.infoText}`}>
      {children}
    </div>
  );
}
