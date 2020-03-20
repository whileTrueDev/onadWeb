import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// nodejs library to set properties for components

// core components
import cardHeaderStyle from './CardHeader.style';

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
  plain?: boolean;
  stats?: boolean;
  icon?: boolean;
  color?: string;
}

function CardHeader({
  className,
  children,
  plain,
  stats,
  icon,
  ...rest
}: CardHeaderProps): JSX.Element {
  const classes = cardHeaderStyle();
  const cardHeaderClasses = classNames({
    [classes.cardHeader]: true,
    [classes.cardHeaderPlain]: plain,
    [classes.cardHeaderStats]: stats,
    [classes.cardHeaderIcon]: icon,
    [className || '']: className !== undefined,
  });
  return (
    <div className={cardHeaderClasses} {...rest}>
      {children}
    </div>
  );
}
export default CardHeader;
