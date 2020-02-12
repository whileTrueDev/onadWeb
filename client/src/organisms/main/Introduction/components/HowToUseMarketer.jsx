import React from 'react';
import shortid from 'shortid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '../../Main/components/Typography';
import useDialog from '../../../../utils/lib/hooks/useDialog';
import Dialog from './Dialog';
import Inquire from '../../Main/views/Inquire/Inqurie';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(0),
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
  },
  sampleLink: {
    color: 'white',
    fontFamily: 'Noto Sans kr',
    border: '1px solid white',
    padding: '5px 10px',
    fontSize: 16,
    marginTop: 20
  },
  contentImg: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

const HowToUsemarketer = (props) => {
  const classes = useStyles();
  const InquireDialog = useDialog();
  const [imgStep, setImgStep] = React.useState('banner');
  const UseStep = useDialog();
  const {
    source
  } = props;

  return (
    <Container className={classes.root} component="section">
      <Grid className={classes.marketerUse}>
        <Grid container className={classes.numbertable}>
          <Grid item xs={12} md={3} className={classes.marketerUse}>
            <div className={classes.useNumber}>1</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: '600' }}>
              배너등록
            </Typography>
            <div className={classes.Content}>
              {source.firstContent.split('\n').map(row => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
            <Button className={classes.sampleLink} onClick={() => { setImgStep('banner'); UseStep.handleOpen(); }}>
              &gt;&nbsp;샘플보기
            </Button>
            <Button className={classes.inquireLink} onClick={() => { InquireDialog.handleOpen(); }}>
              배너가 아직 없으시다면 클릭!
            </Button>
          </Grid>
          <Grid item xs={12} md={3} className={classes.marketerUse}>
            <div className={classes.useNumber}>2</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: '600' }}>
              캠페인생성
            </Typography>
            <div className={classes.Content}>
              {source.secondContent.split('\n').map(row => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
            <Button className={classes.sampleLink} onClick={() => { setImgStep('campaign'); UseStep.handleOpen(); }}>
              &gt;&nbsp;샘플보기
            </Button>
          </Grid>
          <Grid item xs={12} md={3} className={classes.marketerUse}>
            <div className={classes.useNumber}>3</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: '600' }}>
              광고송출확인
            </Typography>
            <div className={classes.Content}>
              {source.thirdContent.split('\n').map(row => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
            <Button className={classes.sampleLink} onClick={() => { setImgStep('confirm'); UseStep.handleOpen(); }}>
              &gt;&nbsp;샘플보기
            </Button>
          </Grid>
          <Grid item xs={12} md={3} className={classes.marketerUse}>
            <div className={classes.useNumber}>4</div>
            <Typography variant="h5" component="h2" style={{ color: 'white', fontFamily: 'Noto Sans kr', fontWeight: '600' }}>
              세금계산서 발행
            </Typography>
            <div className={classes.Content}>
              {source.fourthContent.split('\n').map(row => (
                <Typography variant="body1" key={shortid.generate()}>{`${row}`}</Typography>
              ))}
            </div>
            <Button className={classes.sampleLink} onClick={() => { setImgStep('taxbill'); UseStep.handleOpen(); }}>
              &gt;&nbsp;샘플보기
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={Boolean(InquireDialog.open)}
        onClose={InquireDialog.handleClose}
        fullWidth
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
      <Dialog
        open={Boolean(UseStep.open)}
        onClose={UseStep.handleClose}
        fullWidth
        maxWidth="md"
      >
        <img src={`./pngs/introduction/${imgStep}.png`} className={classes.contentImg} alt="sample" />
      </Dialog>
    </Container>
  );
};


HowToUsemarketer.propTypes = {
  source: PropTypes.object,
};

HowToUsemarketer.defaultProps = {
  source: '',
};


export default HowToUsemarketer;
