import { nanoid } from 'nanoid';
import {
  Paper,
  Grid,
  Typography,
  Divider,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import Refresh from '@material-ui/icons/Refresh';
import { makeStyles } from '@material-ui/core/styles';
import { useMarketerActionLog } from '../../../../utils/hooks/query/useMarketerActionLog';

const styles = makeStyles(() => ({
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

function makeContents(typeNumber: number, detail: string) {
  const details = JSON.parse(detail);
  // 0 - 이벤트 캐시충전 (온애드에서 제공되는)
  // 1 - 자가 캐시충전  v-191226 X : 무통장입급 캐시충전 기능 x이기 떄문.
  // 2 - 배너 업로드(생성) v-191226 ㅁ
  // 3 - 배너 승인 v-191226 ㅇ
  // 4 - 배너 거절 v-191226 ㅇ
  // 5 - 캠페인 생성 v-191226 ㅇ
  // 6 - 캠페인 on / off v-191226 ㅇ
  // 7 - 마케터 광고 on / off v-191226 ㅇ
  // 8 - 세금계산서 발행 / 미발행
  // 9 - 환불요청  v-191226
  // 10 - 환불요청결과
  // 11 - 배너 삭제 v-191227
  // 12 - 캠페인 삭제 v-191227
  // 13 - 링크 심사 거절 v-200129
  // 14 - 링크 심사 승인 v-200129
  let content = '';
  switch (typeNumber) {
    case 0:
      content = '이벤트 캐시충전';
      return content;
    case 1:
      content = `${details.chargeCash} 원 캐시충전`;
      return content;
    case 2:
      content = `${details.bannerId} 배너 업로드, 심사 진행`;
      return content;
    case 3:
      content = `${details.bannerId} 배너 심사 승인됨`;
      return content;
    case 4:
      content = `${details.bannerId} 배너 심사 거절됨`;
      return content;
    case 5:
      content = `${details.campaignName} 캠페인 생성`;
      return content;
    case 6:
      content = `${details.campaignName} 캠페인 ${details.onoffState ? 'ON' : 'OFF'}`;
      return content;
    case 7:
      content = `광고 스위치 ${details.onoffState ? 'ON' : 'OFF'}`;
      return content;
    case 8:
      content = '세금계산서 발행';
      return content;
    case 9:
      content = `${details.refundCash} 원 환불요청`;
      return content;
    case 10:
      content = ' 환불요청결과';
      return content;
    case 11:
      content = `${details.bannerId} 배너 삭제`;
      return content;
    case 12:
      content = `${details.campaignName} 캠페인 삭제`;
      return content;
    case 13:
      content = `${details.linkId} URL 심사 거절됨`;
      return content;
    case 14:
      content = `${details.linkId} URL 심사 승인됨`;
      return content;
    default:
      throw Error('typeNumber must be need');
  }
}

export default function IssueTable(): JSX.Element {
  const actionLog = useMarketerActionLog();
  const classes = styles();

  return (
    <Paper style={{ height: 'auto' }}>
      <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6">활동</Typography>
        </div>

        <IconButton
          size="small"
          onClick={() => {
            actionLog.refetch();
          }}
        >
          <Tooltip title="활동내역 새로고침">
            <Refresh />
          </Tooltip>
        </IconButton>
      </div>

      <Divider />

      <Grid container style={{ height: '430px', overflow: 'auto' }}>
        {/* 데이터 있는 경우 */}
        {actionLog.isLoading && (
          <Grid item xs={12} className={classes.loading}>
            <Typography variant="body2">활동내역 데이터를 로드하고 있습니다.</Typography>
            <div style={{ textAlign: 'center' }}>
              <CircularProgress />
            </div>
          </Grid>
        )}
        {!actionLog.isLoading && actionLog.data && actionLog.data.length > 0 && (
          <List component="nav" style={{ width: '100%' }} aria-label="issue-table">
            {actionLog.data
              // eslint-disable-next-line no-nested-ternary
              .sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0))
              .map((r, index) => (
                <div key={nanoid()}>
                  <ListItem style={{ justifyContent: 'space-between' }}>
                    <ListItemText primary={makeContents(r.type, r.detail)} secondary={r.date} />
                  </ListItem>
                  {actionLog.data && index !== actionLog.data.length - 1 && <Divider light />}
                </div>
              ))}
          </List>
        )}
        {!actionLog.isLoading && actionLog.data && actionLog.data.length === 0 && (
          // 데이터 없는 경우
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography variant="body2">아직 활동내역이 없습니다.</Typography>
          </div>
        )}
      </Grid>
    </Paper>
  );
}
