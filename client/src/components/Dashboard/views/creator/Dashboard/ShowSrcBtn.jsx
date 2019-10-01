import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// material core
import TextField from '@material-ui/core/TextField';
// material styles
import withStyles from '@material-ui/core/styles/withStyles';
// material icons
import RemoveRedEyeOutlined from '@material-ui/icons/RemoveRedEyeOutlined';
import InsertLinkOutlined from '@material-ui/icons/InsertLinkOutlined';
import axios from '../../../../../utils/axios';

import Button from '../../../components/CustomButtons/Button';
import Snackbar from '../../../components/Snackbar/Snackbar';
import HOST from '../../../../../config';

const styles = theme => ({
  button: {
    textAlign: 'center',
  },
  buttonWrapper: {
    textAlign: 'center',
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(8),
  },
  textField: {
    width: '85%',
  },
  overlayWrapper: {
    display: 'flex',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButton: {
    textAlign: 'center',
    width: '20px',
  },
});

class ShowSrcBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSrc: null,
      value: '[주소 보기] 버튼을 누르세요.',
      disabled: false,
      copySuccess: false,
      contractionAgreement: 1,
    };
  }

  componentDidMount() {
    // url 데이터 가져와 state로 입력.
    axios.get(`${HOST}/api/dashboard/creator/overlayUrl`)
      .then((res) => {
        if (res.data) {
          let url = '';
          if (res.data.creatorContractionAgreement === 0) {
            url = '온애드와 계약하지 않았어요! 계약해주세요.';
          } else { url = `https://banner.onad.io/banner${res.data.advertiseUrl}`; }

          this.setState({
            showSrc: url,
            contractionAgreement: res.data.creatorContractionAgreement,
          });
        } else {
          this.setState({
            showSrc: '지금은 확인이 불가능 합니다. 잠시후 시도해 주세요.',
            contractionAgreement: 1,
          });
        }
      }).catch(() => {
        this.setState({
          showSrc: '지금은 확인이 불가능 합니다. 잠시후 시도해 주세요.',
          contractionAgreement: 1,
        });
      });
  }

  showSrcTimer = () => {
    const { showSrc, contractionAgreement } = this.state;
    if (contractionAgreement === 1) {
      this.setState({
        value: showSrc,
        disabled: true,
      });
    } else {
      this.setState({
        value: showSrc,
        disabled: false,
      });
    }
    setTimeout(this.timeFunction, 8 * 1000);
  }

  timeFunction = () => {
    this.setState({
      disabled: false,
      value: '[주소 보기] 버튼을 누르면 주소가 10초간 표시됩니다',
    });
  }

  // 클립보드에 카피 함수
  // get this from stackoverflow
  copyToClipboard = (e) => {
    e.preventDefault();
    const overlayUrl = document.getElementById('overlayUrl');
    overlayUrl.select();
    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    e.target.focus();
    this.setState({ copySuccess: true });
  };

  render() {
    const {
      disabled, value, copySuccess, contractionAgreement,
    } = this.state;
    const { classes } = this.props;

    return (
      <div>
        {/* 만약 계약을 하였다면 */}
        <div className={classes.buttonWrapper}>
          <Button
            className={classes.button}
            color="warning"
            onClick={this.showSrcTimer}
            disabled={disabled}
          >
            <RemoveRedEyeOutlined />
          주소보기
          </Button>
          {/* <Button
            disabled={!contractionAgreement}
            className={classes.button}
            color="info"
            onClick={() => { window.open(showSrc); }}
          >
            <OpenInNewOutlined />
          창열기
          </Button> */}
        </div>

        <div className={classes.overlayWrapper}>
          <TextField
            className={classes.textField}
            id="overlayUrl"
            label="오버레이 URL 주소"
            value={value}
            inputprops={{
              readOnly: true,
            }}
            variant="outlined"
          />
          <Button
            className={classes.copyButton}
            disabled={!disabled}
            onClick={this.copyToClipboard}
          >
            <InsertLinkOutlined />
          복사
          </Button>
          <Snackbar
            place="bc"
            color="success"
            icon
            message="클립보드에 복사되었어요!"
            open={copySuccess}
            closeNotification={() => this.setState({ copySuccess: false })}
            close
          />
          <Snackbar
            place="bl"
            color="danger"
            icon
            message="아직 온애드와 계약하지 않았어요. 간단히 계약하고, 광고를 집행하세요."
            open={!contractionAgreement}
            Link={
              <Button color="warning" component={Link} to="/dashboard/creator/user">계약하러 가기</Button>
          }
          />
        </div>
      </div>
    );
  }
}

ShowSrcBtn.propTypes = {
  classes: PropTypes.object,
};

ShowSrcBtn.defaultProps = {
  classes: {},
};

export default withStyles(styles)(ShowSrcBtn);
