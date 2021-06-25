import { makeStyles, Typography } from '@material-ui/core';
import history from '../../../../../history';

const useStyles = makeStyles(() => ({
  container: { textAlign: 'center' },
  link: { textDecoration: 'underline', cursor: 'pointer' },
}));
export default function SetSettlementSection(): JSX.Element {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.container}>
        <Typography>광고를 진행해서 수익을 창출했다면,</Typography>
        <Typography>
          당연히 &nbsp;
          <Typography component="span" style={{ fontWeight: 'bold' }}>
            수익을 현금화 할수 있어야겠죠?
          </Typography>
        </Typography>

        <br />
        <Typography>온애드에서는 안전하게 수익금을 정산하기 위해</Typography>
        <Typography>방송인님에 대한 몇가지 정보를 요구합니다.</Typography>

        <br />

        <Typography>수익금 출금 신청을 하면 매달 정산 처리 된다. </Typography>
        <Typography>출금을 하기 위해서는 정산 등록이 필요하다.</Typography>
        <Typography>
          출금 신청과 정산등록은 &nbsp;
          <Typography
            color="primary"
            component="span"
            className={classes.link}
            onClick={() => {
              history.push('/mypage/creator/income');
            }}
          >
            [내 수익 관리]
          </Typography>
          &nbsp; 에서 진행할 수 있습니다!
        </Typography>
      </div>
    </div>
  );
}
