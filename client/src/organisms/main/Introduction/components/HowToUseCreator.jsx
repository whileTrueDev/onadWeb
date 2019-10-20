import React from 'react';
import shortid from 'shortid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '../../Main/components/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(0),
  },
  creatorUse: {
    paddingTop: theme.spacing(8),
    color: 'white',
    wordBreak: 'keep-all'
  },
  head: {
    fontFamily: 'Noto Sans KR',
    color: 'white',
    margin: theme.spacing(2, 0),
    fontWeight: '600'
  },
  numbertable: {
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(6),
    textAlign: 'center'
  },
  subTitle: {
    fontFamily: 'Noto Sans KR',
    color: 'white',
    margin: theme.spacing(2, 0)
  },
  useNumber: {
    borderRadius: '100%',
    backgroundColor: 'white',
    margin: '20px auto',
    color: '#FFAA00',
    fontSize: 50,
    width: 80,
    height: 80,
    fontWeight: '600'
  },
  Content: {
    marginTop: theme.spacing(2),
    fontSize: 15
  },
}));

const HowToUseCreator = (props) => {
  const {
    source
  } = props;
  const classes = useStyles();

  return (
    <Container className={classes.root} component="section">
      <Grid className={classes.creatorUse}>
        {/* <Grid item xs={12} md={6} className={classes.cardWrapper}> */}
        {/* <div className={classes.card}> */}
        {/* <div className={classes.cardContent}> */}
        <Typography variant="h4" component="h2" className={classes.head}>
          {source.head}
        </Typography>
        <Typography variant="h5" component="h2" className={classes.subTitle}>
          {source.subTitle}
        </Typography>
        <Grid container className={classes.numbertable}>
          <Grid item xs={12} md={3} className={classes.creatorUse}>
            <div className={classes.useNumber}>1</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: '600' }}>
              {'회원가입'}
            </Typography>
            <div className={classes.Content}>
              {source.firstContent.split('\n').map((row, i) => (
                <p key={shortid.generate()}>{`${row}`}</p>
              ))}
            </div>
          </Grid>
          <Grid item xs={12} md={3} className={classes.creatorUse}>
            <div className={classes.useNumber}>2</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: '600' }}>
              {'URL복사'}
            </Typography>
            <div className={classes.Content}>
              {source.secondContent.split('\n').map((row, i) => (
                <p key={shortid.generate()}>{`${row}`}</p>
              ))}
            </div>
          </Grid>
          <Grid item xs={12} md={3} className={classes.creatorUse}>
            <div className={classes.useNumber}>3</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: '600' }}>
              {'방송송출적용'}
            </Typography>
            <div className={classes.Content}>
              {source.thirdContent.split('\n').map((row, i) => (
                <p key={shortid.generate()}>{`${row}`}</p>
              ))}
            </div>
          </Grid>
          <Grid item xs={12} md={3} className={classes.creatorUse}>
            <div className={classes.useNumber}>4</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: '600' }}>
              {'금액반환'}
            </Typography>
            <div className={classes.Content}>
              {source.fourthContent.split('\n').map((row, i) => (
                <p key={shortid.generate()}>{`${row}`}</p>
              ))}
            </div>
          </Grid>
        </Grid>
        {/* <Typography variant="body1">
                  {source.body.split('\n').map((row, index) => (
                    <p key={source.body+index} style={{fontFamily:'Noto Sans kr'}}>{`${row}`}</p>
                  ))}
                </Typography> */}
        {/* </div> */}
        {/* </div> */}
      </Grid>
      {/* </Grid> */}
    </Container>
  );
};


HowToUseCreator.propTypes = {
  source: PropTypes.object, // text sources
};

HowToUseCreator.defaultProps = {
  source: '',
};


export default HowToUseCreator;
