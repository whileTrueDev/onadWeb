import { Grid } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(() => ({
  sampleImg: {
    width: 400,
    height: 250,
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

function ImageUploadIdentity(): JSX.Element {
  const classes = useStyles();

  return (
    <div>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        className={classes.wraper}
      >
        <Grid item className={classes.title}>
          대한민국 거주자의 경우 서비스 이용 관계 법령에 따라 본인 확인 및 온애드로 발생하는 소득에
          대한 원천징수 및 원천징수 신고를 위해 신분증을 제출받습니다.
        </Grid>
        <Grid item>
          <img
            src="/mypage/settlement/idcard.png"
            alt="주민등록증샘플"
            className={classes.sampleImg}
          />
        </Grid>
        <Grid item>
          위의 샘플 이미지와 같이, 모든 정보가 명확히 보이도록 스캔 혹은 촬영하여 정산등록 신청시
          이미지 파일 업로드해주시면 됩니다.
        </Grid>
        <Grid item className={classes.title}>
          업로드 가능 신분증 종류
        </Grid>
        <Grid item>
          <p>- 주민등록증</p>
          <p>- 운전면허증</p>
          <p>- 여권(대한민국발행)</p>
          <p>
            - 주민등록증발급신청확인서 (유효기간 이내의 사진 및 주요 정보에 테이핑 처리 된 것에
            한함)
          </p>
          <p>- 청소년증, 청소년증 발급 확인서(청소년증 발급 신청서는 불가)</p>
        </Grid>
        <Grid item>
          위에 해당하는 신분증이더라도 이름 및 주민등록번호 13자리를 확인할 수 있어야 하며, 해당
          정보가 기재되어 있지 않거나 모자이크 처리 된 경우 신분증으로 인정되지 않습니다.
          <p style={{ color: 'red' }}>이미지 크기는 5MB이하로 올려주시기 바랍니다.</p>
        </Grid>
      </Grid>
    </div>
  );
}

export default ImageUploadIdentity;
