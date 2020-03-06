import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
import useCardIconStyle from './CardIcon.style';

interface CardIconProps {
  children: React.ReactNode;
  className?: string | null;
  [rest: string]: any;
}

function CardIcon({
  className,
  children,
  ...rest
}: CardIconProps): JSX.Element {
  const classes = useCardIconStyle();

  const cardIconClasses = classNames({
    [classes.cardIcon]: true,
    [className || '']: className !== undefined,
  });
  return (
    <div className={cardIconClasses} {...rest}>
      {children}
    </div>
  );
}

export default CardIcon;
