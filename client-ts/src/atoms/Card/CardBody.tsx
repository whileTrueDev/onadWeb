import * as React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// style
import useCardBodyStyles from './CardBody.style';

interface CardBodyProps {
  className?: string | null;
  children: React.ReactNode;
  plain?: boolean;
  profile?: boolean;
  [rest: string]: any;
}
function CardBody({ className, children, plain, profile, ...rest }: CardBodyProps): JSX.Element {
  const classes = useCardBodyStyles();
  const cardBodyClasses = classNames({
    [classes.cardBody]: true,
    [classes.cardBodyPlain]: plain,
    [classes.cardBodyProfile]: profile,
    [className || '']: className !== undefined,
  });
  return (
    <div className={cardBodyClasses} {...rest}>
      {children}
    </div>
  );
}

export default CardBody;
