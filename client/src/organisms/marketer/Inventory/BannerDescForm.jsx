import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid, FormControl, InputLabel, Input, FormHelperText, CircularProgress
} from '@material-ui/core';
import CustomButton from '../../../atoms/CustomButtons/Button';

const formStyle = theme => ({
  imgPreview: {
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '200px',
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: '350px',
      maxHeight: '300px',
    },
  },
  input: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#3c4858',
  },
  label: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#00acc1',
    marginBottom: '7px',
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

const CssFormControl = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#00acc1',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#00acc1',
    },
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#00acc1',
      },
    },
  },
})(FormControl);


const BannerDescFrom = (props) => {
  const {
    handleNext, classes, state, handleSubmit,
  } = props;
  const [value, setValue] = React.useState('');
  const [inProgress, setInProgress] = React.useState(false);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <div>
          <img id="preview" src={state.imageUrl} className={classes.imgPreview} alt="배너이미지" />
        </div>
      </Grid>

      <Grid item>
        <CssFormControl
          required
          fullWidth
        >
          <InputLabel shrink htmlFor="company" className={classes.label}>홍보문구 입력</InputLabel>
          <Input
            required
            id="banner"
            multiline
            className={classes.input}
            value={value}
            onChange={handleChange}
          />
          <FormHelperText>
            {' '}
            {'랜딩페이지 클릭 시 보일 홍보문구를 입력해주세요. < 이벤트 / 할인정보 등>'}
            {' '}
          </FormHelperText>
        </CssFormControl>
      </Grid>
      <Grid item>
        <div style={{ maginTop: '16px' }}>
          <CustomButton
            size="sm"
            onClick={handleNext(0)}
          >
          뒤로
          </CustomButton>
          <CustomButton
            variant="contained"
            color="primary"
            size="sm"
            onClick={() => {
              setInProgress(true);
              handleSubmit();
            }}
            disabled={value.length === 0 || inProgress}
          >
          완료
          </CustomButton>
          {inProgress && (
            <CircularProgress
              disableShrink
              size={16}
              thickness={5}
              variant="indeterminate"
              className={classes.buttonProgress}
            />
          )}
        </div>
      </Grid>
    </Grid>

  );
};

BannerDescFrom.propTypes = {
  classes: PropTypes.object.isRequired,
  handleNext: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default withStyles(formStyle)(BannerDescFrom);
