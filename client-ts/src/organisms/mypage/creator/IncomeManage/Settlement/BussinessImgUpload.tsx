import { Grid } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(() => ({
  sampleImg: {
    width: 600,
    height: 900,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    margin: '20px 0',
  },
  wraper: {
    width: '80%',
    margin: 'auto',
  },
}));

function BussinessImgUpload(): JSX.Element {
  const classes = useStyles();

  return (
    <div>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={2}
        className={classes.wraper}
      >
        <Grid item className={classes.title}>
          개인사업자의 경우 서비스 이용 관계 법령에 따라 본인 확인 및 온애드로 발생하는 소득에 대한
          세금계산서를 발행받습니다.
        </Grid>
        <Grid item>
          <img
            src="/pngs/settlement/bussinessID.png"
            alt="사업자등록증샘플"
            className={classes.sampleImg}
          />
        </Grid>
        <Grid item>
          위의 샘플 이미지와 같이, 모든 정보가 명확히 보이도록 스캔 혹은 촬영하여 정산등록 신청시
          이미지 파일 업로드해주시면 됩니다.
        </Grid>
        <Grid item>
          온애드는 전자세금계산서를 발행하며 전자세금계산서 고지에 대한 수신 메일은 트위치의 본인
          개인정보에 기입한 이메일로 발송드립니다.
          <p>
            다른 이메일로 발송을 원하신다면 수신받고자 하는 메일이 기입된 사업자등록증을 업로드
            해주십시오.
          </p>
          <p style={{ color: 'red' }}>이미지 크기는 10MB이하로 올려주시기 바랍니다.</p>
        </Grid>
      </Grid>
    </div>
  );
}

export default BussinessImgUpload;
