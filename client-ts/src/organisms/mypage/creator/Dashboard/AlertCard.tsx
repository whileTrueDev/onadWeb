import { Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export default function AlertCard(): JSX.Element {
  return (
    <Alert severity="error" variant="standard">
      <Typography style={{ fontWeight: 'bold' }}>배너 크기 관련 알림</Typography>
      <Typography>
        내 방송의 해상도가 1920 X 1080(1080p) 이상이면 너비를{' '}
        <span style={{ fontWeight: 'bold' }}>320</span>, 높이를{' '}
        <span style={{ fontWeight: 'bold' }}>160</span> 으로 설정합니다.
      </Typography>
      <Typography>
        내 방송의 해상도가 1280 X 720(720p) 이면 너비를{' '}
        <span style={{ fontWeight: 'bold' }}>214</span>, 높이를{' '}
        <span style={{ fontWeight: 'bold' }}>107</span> 로 설정합니다.
      </Typography>
      <Typography variant="body2" color="textSecondary">
        배너 크기 규정 위반 시 해당 배너 송출과 관련한 적립금이 무효화 될 수 있습니다.
      </Typography>
    </Alert>
  );
}
