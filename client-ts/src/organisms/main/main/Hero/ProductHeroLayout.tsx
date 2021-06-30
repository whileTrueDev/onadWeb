import * as React from 'react';
import useStyles from '../style/ProductHeroLayout.style';

interface ProductHeroLayoutProps {
  children: React.ReactNode;
  isMarketerPage: boolean;
}

function ProductHeroLayout({ children, isMarketerPage }: ProductHeroLayoutProps): JSX.Element {
  const classes = useStyles();

  return (
    <section className={isMarketerPage ? classes.marketer : classes.creator}>{children}</section>
  );
}

export default ProductHeroLayout;
