import classnames from 'classnames';
import { makeStyles, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import OverlayUrlCard, { OverlayUrlRes } from '../OverlayUrlCard';
import history from '../../../../../history';

const useStyles = makeStyles(theme => ({
  container: { textAlign: 'center' },
  section: { margin: theme.spacing(4) },
  bold: { fontWeight: 'bold' },
  alertContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  link: { textDecoration: 'underline', cursor: 'pointer' },
}));
export interface SetOverlaySectionProps {
  overlayUrlData: OverlayUrlRes;
  handleSnackOpen: () => void;
}
export default function SetOverlaySection({
  overlayUrlData,
  handleSnackOpen,
}: SetOverlaySectionProps): JSX.Element {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.container}>
        <Typography>온애드의 광고수익 창출은 배너광고로부터 시작됩니다.</Typography>
        <Typography>배너광고의 수익은 시간과 시청자 수에 비례합니다.</Typography>

        <br />
        <Typography>
          배너 광고 송출은 OBS, XSplit 와 같은 방송 송출프로그램에서 설정할 수 있습니다.
        </Typography>
        <Typography>배너 오버레이를 설정하기 위해 아래의 오버레이URL을 복사해주세요.</Typography>

        <div className={classes.section}>
          <OverlayUrlCard
            overlayUrlData={overlayUrlData}
            handleSnackOpen={handleSnackOpen}
            helperText="[온애드 이용 동의] 가 필요합니다."
          />
        </div>

        <Typography>
          XSplit, OBS 등의 방송 송출 프로그램에 브라우저소스(Webpage 소스) 를 추가한 이후,
        </Typography>

        <Typography>복사된 오버레이URL을 붙여넣어주세요!</Typography>

        <br />
        <Typography className={classes.bold}>이때, 꼭! 다음 사항을 지켜주세요!</Typography>

        <Alert
          severity="error"
          variant="outlined"
          className={classnames(classes.section, classes.alertContainer)}
        >
          <Typography>
            내 방송의 해상도가 1920 X 1080(1080p) 이상이면 너비를{' '}
            <span className={classes.bold}>320</span>, 높이를{' '}
            <span className={classes.bold}>160</span> 으로 설정합니다.
          </Typography>
          <Typography>
            내 방송의 해상도가 1280 X 720(720p) 이면 너비를{' '}
            <span className={classes.bold}>214</span>, 높이를{' '}
            <span className={classes.bold}>107</span> 로 설정합니다.
          </Typography>
        </Alert>

        <Typography>
          배너를 관리하는 데에 대한 더욱 자세한 사항은{' '}
          <Typography
            component="span"
            className={classes.link}
            onClick={() => {
              history.push('/mypage/creator/manual');
            }}
          >
            이용안내
          </Typography>
          를 이용해주세요!
        </Typography>

        <br />
        <Typography>완료하셨다면 [다음] 버튼을 눌러, 클릭광고를 설정해보세요!</Typography>
      </div>
    </div>
  );
}
