import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid, FormControl, InputLabel, Input, FormHelperText,
} from '@material-ui/core';
import CustomButton from '../../../components/CustomButtons/Button';

const formStyle = theme => ({
  imgPreview: {
    width: '100%',
    height: 'auto',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '200px',
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: '600px',
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

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <img id="preview" src={state.imageUrl} className={classes.imgPreview} alt="이미지가 보일 영역" />
      </Grid>
      <Grid item>
        <CssFormControl
          required
          fullWidth
        >
          <InputLabel shrink htmlFor="company" className={classes.label}>회사소개</InputLabel>
          <Input
            required
            id="company"
            multiline
            className={classes.input}
          />
          <FormHelperText>배너를 게시할 크리에이터에게 회사를 소개해주세요.(30자 이내)</FormHelperText>
        </CssFormControl>
      </Grid>
      <Grid item>
        <CssFormControl
          required
          fullWidth
        >
          <InputLabel shrink htmlFor="company" className={classes.label}>배너소개</InputLabel>
          <Input
            required
            id="banner"
            multiline
            className={classes.input}
          />
          <FormHelperText>배너를 게시할 크리에이터에게 배너를 설명해주세요.(30자 이내)</FormHelperText>
        </CssFormControl>
      </Grid>
      <Grid item>
        <CssFormControl
          required
        >
          <InputLabel shrink htmlFor="company" className={classes.label}>URL</InputLabel>
          <Input
            required
            type="url"
            id="url"
            className={classes.input}
          />
          <FormHelperText>랜딩페이지를 통해 접속할 웹페이지를 작성해주세요</FormHelperText>
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
            color="info"
            size="sm"
            onClick={handleSubmit}
          >
          완료
          </CustomButton>
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
