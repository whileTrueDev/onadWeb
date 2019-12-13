import React, { useState } from 'react';
import PropTypes from 'prop-types';
// material core
import { Grid } from '@material-ui/core';
// material styles
import { makeStyles } from '@material-ui/core/styles';
// material icons
import RemoveRedEyeOutlined from '@material-ui/icons/RemoveRedEyeOutlined';
import InsertLinkOutlined from '@material-ui/icons/InsertLinkOutlined';
import Snackbar from '../../../atoms/Snackbar/Snackbar';
import StyledInput from '../../../atoms/StyledInput';
import Button from '../../../atoms/CustomButtons/Button';


const useStyles = makeStyles(() => ({
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
  const defaultUrl = '주소보기 버튼을 누르세요!';
  const notAgreeValue = ' 계약을 먼저 진행해주세요.';
  const [value, setValue] = useState(defaultUrl);
  const [disabled, setDisabled] = useState(true);
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
            value={urlData.payload.creatorContractionAgreement ? value : notAgreeValue}
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
            onClick={disabled ? showSrcTimer : undefined}
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
        handleClose={() => { setCopySuccess(false); }}
      />
    </div>
  );
};

ShowUrl.propTypes = {
  urlData: PropTypes.object
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
