import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'url(\'/pngs/main/creatorDoor.png\') no-repeat center center',
    backgroundSize: 'cover',
    width: '100%',
    height: '700px',
    [theme.breakpoints.down('md')]: {
      height: '600px',
    },
    [theme.breakpoints.down('sm')]: {
      height: '500px'
    },
    [theme.breakpoints.down('xs')]: {
      height: '600px'
    }
  },
  root2: {
    background: 'url(\'/pngs/main/creatorMain.png\') no-repeat center center',
    backgroundSize: 'cover',
    width: '100%',
    height: '700px',
    [theme.breakpoints.down('md')]: {
      height: '600px',
    },
    [theme.breakpoints.down('sm')]: {
      height: '500px'
    },
    [theme.breakpoints.down('xs')]: {
      height: '600px'
    }
  },
  containerWrap: {
    backgroundColor: 'rgb(0,0,0, 0.6)',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
}));

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
