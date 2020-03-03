import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
// icons
import Help from '@material-ui/icons/Help';
import WbSunny from '@material-ui/icons/WbSunny';
import NightsStay from '@material-ui/icons/NightsStay';
// atoms
import StyledItemText from '../../../atoms/StyledItemText';
import CustomCard from '../../../atoms/CustomCard';
import Button from '../../../atoms/CustomButtons/Button';
import Snackbar from '../../../atoms/Snackbar/Snackbar';
import Tooltip from '../../../atoms/DescPopover';
// hooks
import useDialog from '../../../utils/lib/hooks/useDialog';
import useUpdateData from '../../../utils/lib/hooks/useUpdateData';
import useTooltip from '../../../utils/lib/hooks/useTooltip';

const useStyles = makeStyles((theme) => ({
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
  },
}));


export default function LandingSetting(props) {
  const { userData } = props;
  const classes = useStyles();

  // for descriptoin
  const [description, setDescription] = React.useState(userData.payload.creatorDesc);
  function handleDescChange(e) {
    setDescription(e.target.value);
  }
  // for tooltip
  const {
    tooltipIndex, anchorEl, handleTooltipOpen, handleTooltipClose,
  } = useTooltip();

  // for data update
  const updateRequest = useUpdateData('/api/dashboard/creator/landing/update', userData.callUrl);
  const snack = useDialog(); // for sanckbar

  // for landing page theme
  const [darkTheme, setTheme] = React.useState({
    bool: userData.payload.creatorTheme === 'dark',
    theme: userData.payload.creatorTheme
  });
  function handleThemeChange() {
    setTheme({ bool: !darkTheme.bool, theme: !darkTheme.bool ? 'dark' : 'light' });
  }

  return (
    <CustomCard
      iconComponent={<StyledItemText primary="광고페이지 설정" color="white" />}
      buttonComponent={(
        <div className={classnames(classes.flex, classes.flexEnd)}>
          <Button
            color="primary"
            disabled={
            (userData.payload.creatorDesc === description)
            && (userData.payload.creatorTheme === darkTheme.theme)
          }
            onClick={() => {
              updateRequest.handleUpdateRequest({
                description,
                creatorTheme: darkTheme.theme
              });
              if (updateRequest.success) {
                snack.handleOpen();
              }
            }}
          >
            변경 저장하기
          </Button>
        </div>
      )}
    >
      <div style={{ marginBottom: 40 }}>
        <div className={classes.flex}>
          <Typography variant="h6">
            소개글 관리
          </Typography>
          <Help
            fontSize="small"
            color="disabled"
            onMouseEnter={(evt) => handleTooltipOpen(evt, 0)}
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
      </div>

      <div>
        <div className={classes.flex}>

          <Typography variant="h6">
            라이트모드 / 다크모드 관리
          </Typography>
          <Help
            fontSize="small"
            color="disabled"
            onMouseEnter={(evt) => handleTooltipOpen(evt, 1)}
            onMouseLeave={handleTooltipClose}
            aria-owns={anchorEl ? 'send-desc-popover' : undefined}
            aria-haspopup="true"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <WbSunny
            color={!darkTheme.bool ? 'secondary' : 'default'}
            className={classes.icon}
          />
          <Switch color="default" checked={darkTheme.bool} onChange={() => { handleThemeChange(); }} />
          <NightsStay
            color={darkTheme.bool ? 'primary' : 'default'}
            className={classes.icon}
          />
        </div>
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

    </CustomCard>
  );
}

LandingSetting.propTypes = {
  userData: PropTypes.object.isRequired
};
