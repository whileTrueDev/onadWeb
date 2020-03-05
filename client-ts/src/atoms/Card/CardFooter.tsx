import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// styles
import useCardFooterStyles from './CardFooter.style';

interface CardFooterProps {
  children: React.ReactNode;
  plain?: boolean | null;
  profile?: boolean | null;
  className?: string;
}
function CardFooter({
  className,
  children,
  plain,
  profile,
  ...rest
}: CardFooterProps): JSX.Element {
  const classes = useCardFooterStyles();
  const cardFooterClasses = classNames({
    [classes.cardFooterPlain]: plain,
    [classes.cardFooterProfile]: profile,
    [className || '']: className !== undefined,
  });
  return (
    <div className={cardFooterClasses} {...rest}>
      {children}
    </div>
  );
}

export default CardFooter;
