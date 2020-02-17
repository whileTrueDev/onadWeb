import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
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
});

function ProductHeroLayout(props) {
  const {
    children, classes, MainUserType
  } = props;

  return (
    <section className={MainUserType === 'marketer' ? (classes.root) : (classes.root2)}>
      <div className={classes.containerWrap}>
        {children}
      </div>
    </section>
  );
}

ProductHeroLayout.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object,
};

ProductHeroLayout.defaultProps = {
  classes: {},
};

export default withStyles(styles)(ProductHeroLayout);
