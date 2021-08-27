import { Button, makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';

const useStyles = makeStyles(theme => ({
  container: { marginBottom: theme.spacing(1) },
}));
export default function CampaignButtons(): JSX.Element {
  const classes = useStyles();
  const router = useRouter();
  return (
    <div className={classes.container}>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => router.push('/mypage/marketer/campaign-create')}
      >
        + 캠페인 생성
      </Button>
    </div>
  );
}
