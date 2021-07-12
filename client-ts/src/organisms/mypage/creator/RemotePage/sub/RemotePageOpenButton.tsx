import { Button, Typography } from '@material-ui/core';
import { OpenInNew } from '@material-ui/icons';
import StyledTooltip from '../../../../../atoms/Tooltip/StyledTooltip';
import { REACT_HOST } from '../../../../../config';
import { useCreatorRemotePageUrl } from '../../../../../utils/hooks/query/useCreatorRemotePageUrl';

const RemotePageOpenButton = (): JSX.Element => {
  const remotePageUrl = useCreatorRemotePageUrl();

  const POPUP_WIDTH = process.env.NODE_ENV === 'production' ? 900 : 900;
  const POPUP_HEIGHT = process.env.NODE_ENV === 'production' ? 800 : 700;

  const getCorrectUrl = (url: string): string => (url.startsWith('/') ? url.replace('/', '') : url);

  // 개인 리모트 페이지 hash 값 필요
  // remote/{여기 들어가기}
  return (
    <Button
      variant="contained"
      color="primary"
      disabled={!remotePageUrl.data}
      onClick={(): void => {
        if (remotePageUrl.data) {
          window.open(
            `${REACT_HOST}/creator/remote/${getCorrectUrl(remotePageUrl.data)}`,
            '_blank',
            `width=${POPUP_WIDTH}, height=${POPUP_HEIGHT}, left=${0}, top=${0}, title="온애드 리모컨"`,
          );
        }
      }}
    >
      {!remotePageUrl.data ? (
        <StyledTooltip title={<Typography variant="body2">이용 동의 필요</Typography>}>
          <Typography variant="body2" style={{ display: 'flex', alignItems: 'center' }}>
            실시간 광고 제어
            <OpenInNew fontSize="small" style={{ verticalAlign: 'middle' }} />
          </Typography>
        </StyledTooltip>
      ) : (
        <Typography variant="body2" style={{ display: 'flex', alignItems: 'center' }}>
          실시간 광고 제어
          <OpenInNew fontSize="small" style={{ verticalAlign: 'middle' }} />
        </Typography>
      )}
    </Button>
  );
};

export default RemotePageOpenButton;
