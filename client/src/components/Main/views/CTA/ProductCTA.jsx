import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';
import Typography from '../../components/Typography';
import TextField from '../../components/TextField';
import Snackbar from '../../components/Snackbar';
import Button from '../../components/Button';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  cardWrapper: {
    zIndex: 1,
  },
  card: {
    marginTop: theme.spacing(5),
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#dddd',
    padding: theme.spacing(8, 3),
  },
  cardContent: {
    maxWidth: 400,
  },
  textField: {
    width: '100%',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  button: {
    width: '100%',
  },
  imagesWrapper: {
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 150,
    left: -48,
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: 600,
  },
});

class ProductCTA extends React.Component {
  state = {
    open: false,
    inquiryErr: false,
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const userEmail = event.target.email.value;
    const inquiryText = event.target.inquiry.value;

    axios.post('/inquiry', {
      data: {
        email: userEmail,
        inquiryText,
      },
    }).then((res) => {
      console.log(res);
      this.setState({
        open: true,
      });
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
      inquiryErr: false,
    });
  };

  render() {
    const { open, inquiryErr } = this.state;
    const { classes } = this.props;

    return (
      <Container className={classes.root} component="section">
        <Typography variant="h4" marked="center" align="center" component="h2">
          도움이 필요하세요?
        </Typography>
        <Grid container>

          <Grid item xs={12} md={6} className={classes.cardWrapper}>
            <div className={classes.card}>
              <form onSubmit={this.handleSubmit} className={classes.cardContent}>
                <Typography align="center" variant="h2" component="h2" gutterBottom>
                  문의하세요.
                </Typography>
                <Typography variant="h5" align="center">
                  무엇이든 궁금하신점, 불편하신점, 언제든 연락하세요.
                </Typography>
                <TextField
                  id="email"
                  noBorder
                  className={classes.textField}
                  placeholder="이메일을 입력해 주세요. 이곳으로 답장이 보내집니다."
                />
                <TextField
                  id="inquiry"
                  noBorder
                  multiline
                  rows="5"
                  className={classes.textField}
                  placeholder="내용을 입력해 주세요."
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  제출하기
                </Button>
              </form>
            </div>
          </Grid>
          <Grid item xs={12} md={6} className={classes.imagesWrapper}>
            <Hidden smDown>
              <img
                src="/images/captain.jpg"
                alt="call to action"
                className={classes.image}
              />
            </Hidden>
          </Grid>
        </Grid>
        {inquiryErr
          ? (
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              open={open}
              color="secondary"
              autoHideDuration={3000}
              onClose={this.handleClose}
              message="오류에요..! 직접 보내실래요? support@onad.com"
            />
          )
          : (
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              open={open}
              autoHideDuration={3000}
              onClose={this.handleClose}
              message="제출되었어요! 빠른 시일 내에 답장 드릴게요!"
            />
          )
        }

      </Container>
    );
  }
}

ProductCTA.propTypes = {
  classes: PropTypes.object,
};

ProductCTA.defaultProps = {
  classes: {},
};


export default withStyles(styles)(ProductCTA);
