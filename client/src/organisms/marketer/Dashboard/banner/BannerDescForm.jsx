import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid
} from '@material-ui/core';
import CustomButton from '../../../../atoms/CustomButtons/Button';

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
});

const BannerDescFrom = (props) => {
  const {
    handleNext, classes, state, handleSubmit,
  } = props;

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <div>
          <img id="preview" src={state.imageUrl} className={classes.imgPreview} alt="배너이미지" />
        </div>
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
