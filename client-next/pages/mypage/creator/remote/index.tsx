import Paper from '@material-ui/core/Paper';
import { useRouter } from 'next/router';
import RemotePageBannerTable from '../../../../components/mypage/creator/remotePage/remotePageBannerTable';

const RemotePage = (): JSX.Element => {
  const router = useRouter();
  const creatorId = router.query.creatorId as string;
  return (
    <Paper>
      <RemotePageBannerTable pageUrl={creatorId} />
    </Paper>
  );
};

export default RemotePage;
