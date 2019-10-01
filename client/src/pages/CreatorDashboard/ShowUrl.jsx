import React, { useState } from 'react';
import PropTypes from 'prop-types';
// material core
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
// material styles
import { makeStyles } from '@material-ui/core/styles';
// material icons
import RemoveRedEyeOutlined from '@material-ui/icons/RemoveRedEyeOutlined';
import InsertLinkOutlined from '@material-ui/icons/InsertLinkOutlined';
import Snackbar from '../../components/NewCreates/Snackbar/Snackbar';
import StyledInput from '../../components/NewCreates/StyledInput';
import Button from '../../components/NewCreates/CustomButtons/Button';


const useStyles = makeStyles(theme => ({
  button: {
    margin: 0,
    // padding: '2px',
    minWidth: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textField: {
    width: '100%',
  },
  line: {
    alignItems: 'center'
  }
}));

const ShowUrl = (props) => {
  const { urlData } = props;
  const classes = useStyles();
  const defaultUrl = '[주소 보기] 버튼을 누르면 주소가 10초간 표시됩니다';
  const [value, setValue] = useState(defaultUrl);
  const [disabled, setDisabled] = useState(true);
  const [contractionAgreement, setContractionAgreement] = useState(1);
  const [copySuccess, setCopySuccess] = useState(false); // snackbar를 위한 State

  const showSrcTimer = () => {
    setValue(urlData.payload.advertiseUrl);
    setDisabled(false);
    setTimeout(() => {
      setValue(defaultUrl);
      setDisabled(true);
    }, 8 * 1000);
  };

  // 클립보드에 카피 함수
  // get this from stackoverflow
  const copyToClipboard = (e) => {
    e.preventDefault();
    const overlayUrl = document.getElementById('overlayUrl');
    overlayUrl.select();
    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    e.target.focus();
    setCopySuccess(true);
  };

  return (
    <div>
      <Grid container direction="row" spacing={1} className={classes.line}>
        <Grid item xs={12} sm={8}>
          <StyledInput
            className={classes.textField}
            id="overlayUrl"
            value={value}
            inputprops={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <Button
            className={classes.button}
            disabled={disabled}
            onClick={copyToClipboard}
          >
            <InsertLinkOutlined />
                복사
          </Button>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Button
            className={classes.button}
            color="warning"
            onClick={disabled && showSrcTimer}
          >
            <RemoveRedEyeOutlined />
                  주소보기
          </Button>
        </Grid>

        {/* 만약 계약을 하였다면 */}

      </Grid>
      <Snackbar
        place="bc"
        color="success"
        icon
        message="클립보드에 복사되었어요!"
        open={copySuccess}
        closeNotification={() => setCopySuccess(false)}
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
  );
};

ShowUrl.propTypes = {

};

ShowUrl.defaultProps = {
  urlData: {
    error: false,
    payload: {
      contractionAgreement: 1,
    }
  }
};

export default ShowUrl;
