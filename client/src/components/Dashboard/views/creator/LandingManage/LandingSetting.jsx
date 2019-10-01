import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Help from '@material-ui/icons/Help';
import TextField from '../../../components/TextField/TextField';
import Button from '../../../components/CustomButtons/Button';
import Snackbar from '../../../components/Snackbar/Snackbar';
import Tooltip from '../../../../../pages/CampaignCreate/DescPopover';
// hooks
import useDialog from '../../../lib/hooks/useDialog';
import useUpdateData from '../../../lib/hooks/useUpdateData';

const useStyles = makeStyles(theme => ({
  flex: {
    display: 'flex'
  },
  flexEnd: {
    justifyContent: 'flex-end'
  },
  textField: {
    width: '100%',
    [theme.breakpoints.up('lg')]: {
      width: '50%',
    },
    marginRight: theme.spacing(1)
  }
}));

function useTooltip() {
  const [tooltipIndex, setTooltipIndex] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  function handleTooltipOpen(e, index) {
    setAnchorEl(e.currentTarget);
    setTooltipIndex(index);
  }
  function handleTooltipClose() {
    setAnchorEl(null);
  }
  return {
    tooltipIndex, anchorEl, handleTooltipOpen, handleTooltipClose
  };
}

export default function LandingSetting(props) {
  const { userData } = props;
  const classes = useStyles();
  const [description, setDescription] = React.useState(userData.payload.creatorDesc);
  function handleDescChange(e) {
    setDescription(e.target.value);
  }

  // for tooltip
  const {
    tooltipIndex, anchorEl, handleTooltipOpen, handleTooltipClose,
  } = useTooltip();

  // for data update
  const updateRequest = useUpdateData('/api/dashboard/creator/landing/desc', userData.callUrl);
  const snack = useDialog(); // for sanckbar


  return (
    <div>

      <div className={classes.flex}>
        <Typography variant="body1">
            소개글 관리
        </Typography>
        <Help
          fontSize="small"
          color="disabled"
          onMouseEnter={evt => handleTooltipOpen(evt, 0)}
          onMouseLeave={handleTooltipClose}
          aria-owns={anchorEl ? 'send-desc-popover' : undefined}
          aria-haspopup="true"
        />
      </div>


      <div>
        <TextField
          multiline
          rows={4}
          label="소개글"
          name="description"
          id="description"
          margin="normal"
          value={description}
          onChange={handleDescChange}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>

      <div className={classnames(classes.flex, classes.flexEnd)}>
        <Button
          color="info"
          onClick={() => {
            updateRequest.handleUpdateRequest({ description });
            if (updateRequest.success) {
              snack.handleOpen();
            }
          }}
        >
          변경하기
        </Button>
      </div>

      <Tooltip
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handlePopoverClose={handleTooltipClose}
        descIndex={tooltipIndex}
        contentType="landingManage"
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      />

      <Snackbar
        open={snack.open}
        message="정상적으로 변경되었습니다."
        handleClose={snack.handleClose}
        close
      />

    </div>
  );
}

LandingSetting.propTypes = {
  userData: PropTypes.object.isRequired
};
