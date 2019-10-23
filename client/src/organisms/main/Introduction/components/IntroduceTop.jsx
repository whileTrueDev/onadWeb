import React from 'react';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import Image from './Image';
import Typography from '../../Main/components/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.grey[100],
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  sources: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(8),
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300,
    width: '100%',
  },
  title: {
    marginTop: theme.spacing(3),
  },
  bottomMiddle: {
    marginBottom: theme.spacing(0),
    marginTop: theme.spacing(8)
  },
  bottomtitle: {
    [theme.breakpoints.up('sm')]: {
      fontSize: '40px',
      fontWeight: '700'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '30px',
      fontWeight: '600'
    },
  },
  bottomContent: {
    [theme.breakpoints.up('sm')]: {
      fontSize: '30px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '20px',
    },
  }
}));

export default function IntroduceTop(props) {
  const { source } = props;
  const classes = useStyles();

  return (
    <section className={classes.root}>
      <Container maxWidth="lg" className={classes.container} component="section">
        <div className={classes.bottomMiddle}>
          <Typography
            component="h2"
            className={classes.bottomtitle}
            style={{ fontFamily: 'Noto Sans kr', marginBottom: 32 }}
          >
            ONAD와 함께 하세요
          </Typography>
        </div>

        <div className={classes.sources}>

          {source.map(image => (
            <Image
              key={shortid.generate()}
              image={image}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
