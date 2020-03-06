import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// style
import useCardAvaterStyles from './CardAvatar.style';

interface CardAvaterProps {
  children: React.ReactNode;
  className?: string;
  plain?: boolean;
  profile?: boolean;
}

function CardAvatar({
  children, className, plain, profile, ...rest
}: CardAvaterProps): JSX.Element {
  const classes = useCardAvaterStyles();
  const cardAvatarClasses = classNames({
    [classes.cardAvatar]: true,
    [classes.cardAvatarProfile]: profile,
    [classes.cardAvatarPlain]: plain,
    [className || '']: className !== undefined,
  });
  return (
    <div className={cardAvatarClasses} {...rest}>
      {children}
    </div>
  );
}

export default CardAvatar;
