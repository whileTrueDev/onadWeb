import React from 'react';
import useStyles from '../style/ProductHeroLayout.style';

interface ProductHeroLayoutProps {
  children: React.ReactNode;
  MainUserType: boolean;
}

function ProductHeroLayout({ children, MainUserType }: ProductHeroLayoutProps): JSX.Element {
  const classes = useStyles();

  return (
    <section className={MainUserType ? classes.marketer : classes.creator}>{children}</section>
  );
}

export default ProductHeroLayout;
