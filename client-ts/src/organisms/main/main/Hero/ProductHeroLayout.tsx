import React from 'react';
import useStyles from '../style/ProductHeroLayout.style';

interface Props {
  children: React.ReactNode;
  MainUserType: string;
}

function ProductHeroLayout({ children, MainUserType }: Props): JSX.Element {
  const classes = useStyles();

  return (
    <section className={MainUserType === 'marketer' ? (classes.root) : (classes.root2)}>
      <div className={classes.containerWrap}>
        {children}
      </div>
    </section>
  );
}

export default ProductHeroLayout;
