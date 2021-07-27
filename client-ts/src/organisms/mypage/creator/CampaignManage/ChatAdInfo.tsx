import {
  FormControlLabel,
  Hidden,
  makeStyles,
  Paper,
  Popover,
  Switch,
  Typography,
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import classnames from 'classnames';
import { useSnackbar } from 'notistack';
import { useAnchorEl } from '../../../../utils/hooks';
import { useCreatorUpdateAdchatAgreementMutation } from '../../../../utils/hooks/mutation/useCreatorUpdateAdchatAgreementMutation';
import { useCreatorAdchatAgreement } from '../../../../utils/hooks/query/useCreatorAdChatAgreement';
import { useCreatorProfile } from '../../../../utils/hooks/query/useCreatorProfile';

const useStyles = makeStyles(theme => ({
  bold: { fontWeight: theme.typography.fontWeightBold },
  highlight: { color: theme.palette.primary.main },
  container: {
    height: 200,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  onoffButton: { marginTop: theme.spacing(4), textAlign: 'center' },
  popover: { maxWidth: 450 },
  popoverContents: { padding: theme.spacing(4) },
  alignCenter: { textAlign: 'center' },
}));

export default function ChatAdInfo(): JSX.Element {
  const creatorProfile = useCreatorProfile();
  const adchatAgreement = useCreatorAdchatAgreement();
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();
  const descAnchor = useAnchorEl();

  // OnOff toggle
  const onOffUpdate = useCreatorUpdateAdchatAgreementMutation();
  const handleSwitch = (): void => {
    onOffUpdate
      .mutateAsync({ targetOnOffState: !adchatAgreement.data?.adChatAgreement })
      .then(() => enqueueSnackbar('정상적으로 변경되었습니다.', { variant: 'success' }))
      .catch(() =>
        enqueueSnackbar(
          '변경중 오류가 발생했습니다. 문제가 지속되는 경우 support@onad.io로 문의바랍니다.',
          { variant: 'error' },
        ),
      );
  };

  return (
    <Paper className={classes.container}>
      <div style={{ height: '100%' }}>
        <Typography className={classes.bold}>
          내 채팅 광고 상태
          <Hidden smDown>
            <Typography
              aria-owns={descAnchor.open ? 'mouse-over-popover' : undefined}
              component="span"
              aria-haspopup="true"
              style={{ cursor: 'pointer' }}
              onClick={descAnchor.handleAnchorOpen}
            >
              <HelpIcon fontSize="small" />
            </Typography>
          </Hidden>
        </Typography>

        <Typography variant="caption" color="textSecondary">
          현재 트위치만 가능합니다.
        </Typography>

        {!creatorProfile.isLoading && creatorProfile.data && (
          <div className={classes.onoffButton}>
            <FormControlLabel
              label="끄기/켜기"
              // 온애드 이용 동의를 안했거나, 트위치 연동을 안한 경우
              disabled={
                !creatorProfile.data.creatorContractionAgreement ||
                !creatorProfile.data.creatorTwitchOriginalId
              }
              control={
                <Switch
                  color="primary"
                  checked={Boolean(adchatAgreement.data?.adChatAgreement)}
                  onChange={(): void => {
                    handleSwitch();
                  }}
                />
              }
            />
            {Boolean(adchatAgreement.data?.adChatAgreement) && (
              <Typography variant="body2" color="textSecondary">
                채팅창에서
                <Typography variant="body2" color="primary" component="span">
                  /mod onadbot
                </Typography>
                <Typography component="span" variant="body2" color="textSecondary">
                  명령어를 입력해주세요!
                </Typography>
              </Typography>
            )}
            {!creatorProfile.data.creatorContractionAgreement && (
              <Typography variant="body2" color="textSecondary">
                이용동의가 필요합니다.
              </Typography>
            )}
            {creatorProfile.data.creatorContractionAgreement &&
              !creatorProfile.data.creatorTwitchOriginalId && (
                <Typography variant="body2" color="textSecondary">
                  트위치TV 연동이 필요합니다.
                </Typography>
              )}
          </div>
        )}
      </div>

      {descAnchor.open && (
        <Popover
          disableScrollLock
          className={classes.popover}
          id="mouse-over-popove"
          open={descAnchor.open}
          anchorEl={descAnchor.anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={descAnchor.handleAnchorClose}
          disableRestoreFocus
        >
          <div className={classnames(classes.popoverContents, classes.alignCenter)}>
            <div className={classes.alignCenter}>
              <img src="/pngs/dashboard/bot_example.png" alt="bot_example" width="320px" />
            </div>
            <Typography variant="body2">
              온애드의 광고채팅봇 onadbot은 주기적으로 광고에 대한 설명과 광고 링크를 채팅으로
              자동홍보합니다. 시청자가 onadbot이 홍보한 링크를 클릭하면, 클릭에 대한 수익이
              방송인에게 발생합니다.
            </Typography>
            <br />
            <Typography variant="body2">
              onadbot이 채널 채팅창에서 홍보하는 것을 허용하려면{' '}
              <span className={classnames(classes.highlight, classes.bold)}>스위치를 On</span>{' '}
              시켜주세요. 스위치를 켜기만 하면 자동으로 광고가 송출됩니다.
            </Typography>
            <Typography variant="body2">
              또한, onadbot이 광고채팅을 원활히 진행할 수 있게 채팅창에서 &quot;
              <span className={classnames(classes.highlight, classes.bold)}>/mod onadbot</span>
              &quot;를 입력해 꼭 매니저로 임명해주세요!
            </Typography>

            <br />
            <Typography variant="body2">아프리카TV의 경우 사용할 수 없습니다.</Typography>
          </div>
        </Popover>
      )}
    </Paper>
  );
}
