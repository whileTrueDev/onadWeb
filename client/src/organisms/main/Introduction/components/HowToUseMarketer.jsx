import React from 'react';
import shortid from 'shortid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '../../Main/components/Typography';
import useDialog from '../../../../utils/lib/hooks/useDialog';
import Dialog from './Dialog';
import Inquire from '../../Main/views/Inquire/Inqurie';

const useStyles = makeStyles(theme => ({
  root: {
  },
  marketerUse: {
    paddingTop: theme.spacing(2),
    color: 'white',
    wordBreak: 'keep-all',
    hegiht: 300
  },
  head: {
    fontFamily: 'Noto Sans kr',
    color: 'white',
    margin: theme.spacing(2, 0),
    fontWeight: '600',
    [theme.breakpoints.down('md')]: {
      fontSize: 35,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 27,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
  },
  numbertable: {
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(6),
    textAlign: 'center'
  },
  subTitle: {
    fontFamily: 'Noto Sans kr',
    color: 'white',
    margin: theme.spacing(2, 0)
  },
  useNumber: {
    borderRadius: '100%',
    backgroundColor: 'white',
    margin: '20px auto',
    color: '#3154EB',
    fontSize: 50,
    width: 80,
    height: 80,
    fontWeight: '600'
  },
  Content: {
    marginTop: theme.spacing(2),
    fontSize: 15
  },
  inquireLink: {
    color: 'yellow',
    fontFamily: 'Noto Sans kr',
    border: '1px solid yellow',
    padding: '5px 10px',
    fontSize: 16,
    marginTop: 20
  }
}));

const HowToUsemarketer = (props) => {
  const { source } = props;
  const classes = useStyles();
  const InquireDialog = useDialog();

  return (
    <Container className={classes.root} component="section">
      <Grid className={classes.marketerUse}>
        <Typography variant="h4" component="h2" align="center" className={classes.head}>
          {source.head}
        </Typography>
        <Grid container className={classes.numbertable}>
          <Grid item xs={12} md={3} className={classes.marketerUse}>
            <div className={classes.useNumber}>0</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: '600' }}>
              회원가입
            </Typography>
            <div className={classes.Content}>
              {source.firstContent.split('\n').map(row => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
          </Grid>
          <Grid item xs={12} md={3} className={classes.marketerUse}>
            <div className={classes.useNumber}>1</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: '600' }}>
              배너등록
            </Typography>
            <div className={classes.Content}>
              {source.secondContent.split('\n').map(row => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
            <Button className={classes.inquireLink} onClick={() => { InquireDialog.handleOpen(); }}>
              배너가 아직 없으시다면 클릭!
            </Button>
          </Grid>
          <Grid item xs={12} md={3} className={classes.marketerUse}>
            <div className={classes.useNumber}>2</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: '600' }}>
              배너송출
            </Typography>
            <div className={classes.Content}>
              {source.thirdContent.split('\n').map(row => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
          </Grid>
          <Grid item xs={12} md={3} className={classes.marketerUse}>
            <div className={classes.useNumber}>3</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: '600' }}>
              광고효과보고서
            </Typography>
            <div className={classes.Content}>
              {source.fourthContent.split('\n').map(row => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={Boolean(InquireDialog.open)}
        onClose={InquireDialog.handleClose}
        fullWidth="true"
        maxWidth="md"
        buttons={(
          <div>
            <Button onClick={InquireDialog.handleClose}>
            취소
            </Button>
          </div>
          )}
      >
        <Inquire confirmClose={InquireDialog.handleClose} />
      </Dialog>

    </Container>
  );
};


HowToUsemarketer.propTypes = {
  source: PropTypes.object, // text sources
};

HowToUsemarketer.defaultProps = {
  source: '',
};


export default HowToUsemarketer;
