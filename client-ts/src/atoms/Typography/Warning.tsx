import React from 'react';
import useTypographyStyle from './Typography.style';

interface WarningTypographyProps {children: React.ReactNode}

export default function Warning({ children }: WarningTypographyProps): JSX.Element {
  const classes = useTypographyStyle();
  return (
    <div className={`${classes.defaultFontStyle} ${classes.warningText}`}>
      {children}
    </div>
  );
}
