import React from 'react';
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
import StyledItemText from '../../../../atoms/StyledItemText';
import CustomCard from '../../../../atoms/CustomCard';
import Button from '../../../../atoms/CustomButtons/Button';
import Tooltip from '../../../../atoms/DescPopover';
// hooks
import useTooltip from '../../../../utils/hooks/useTooltip';
//
import usePatchRequest from '../../../../utils/hooks/usePatchRequest';
import AdPageData, { AdPagePatchParamAndRes } from './AdPageData.interfece';

const useStyles = makeStyles(theme => ({
  flex: {
    display: 'flex',
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  textField: {
    width: '100%',
    [theme.breakpoints.up('lg')]: {
      width: '50%',
    },
    marginRight: theme.spacing(1),
  },
}));

interface AdPageSettingProps {
  userData: AdPageData;
  setUserData: React.Dispatch<React.SetStateAction<AdPageData | undefined>>;
  handleSnackOpen: () => void;
}
export default function AdPageSetting({
  userData,
  setUserData,
  handleSnackOpen,
}: AdPageSettingProps): JSX.Element {
  const classes = useStyles();

  // for descriptoin
  function handleDescChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setUserData({ ...userData, creatorDesc: e.target.value });
  }
  // for tooltip
  const { tooltipIndex, anchorEl, handleTooltipOpen, handleTooltipClose } = useTooltip();

  // for data update
  const AdPagePatch = usePatchRequest<AdPagePatchParamAndRes, AdPagePatchParamAndRes>(
    '/creator/ad-page',
    () => {
      handleSnackOpen();
    },
  );

  return (
    <CustomCard
      iconComponent={<StyledItemText primary="광고페이지 설정" color="white" />}
      buttonComponent={
        <div className={classnames(classes.flex, classes.flexEnd)}>
          <Button
            color="primary"
            onClick={(): void => {
              AdPagePatch.doPatchRequest({
                creatorDesc: userData.creatorDesc,
                creatorTheme: userData.creatorTheme,
              });
            }}
          >
            변경 저장하기
          </Button>
        </div>
      }
    >
      <div style={{ marginBottom: 40 }}>
        <div className={classes.flex}>
          <Typography variant="h6">소개글 관리</Typography>
          <div
            onMouseEnter={(evt): void => handleTooltipOpen(evt, 0)}
            onMouseLeave={handleTooltipClose}
          >
            <Help
              fontSize="small"
              color="disabled"
              aria-owns={anchorEl ? 'send-desc-popover' : undefined}
              aria-haspopup="true"
            />
          </div>
        </div>
        <div>
          <TextField
            multiline
            rows={4}
            label="소개글"
            name="description"
            id="description"
            margin="normal"
            value={userData.creatorDesc}
            onChange={handleDescChange}
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
          />
        </div>
      </div>

      <div>
        <div className={classes.flex}>
          <Typography variant="h6">라이트모드 / 다크모드 관리</Typography>
          <div
            onMouseEnter={(evt): void => handleTooltipOpen(evt, 1)}
            onMouseLeave={handleTooltipClose}
          >
            <Help
              fontSize="small"
              color="disabled"
              aria-owns={anchorEl ? 'send-desc-popover' : undefined}
              aria-haspopup="true"
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <WbSunny color={userData.creatorTheme === 'dark' ? 'disabled' : 'secondary'} />
          <Switch
            color="default"
            checked={userData.creatorTheme === 'dark'}
            onChange={(): void => {
              setUserData({
                ...userData,
                creatorTheme: userData.creatorTheme === 'dark' ? 'light' : 'dark',
              });
            }}
          />
          <NightsStay color={userData.creatorTheme === 'dark' ? 'primary' : 'disabled'} />
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
    </CustomCard>
  );
}
