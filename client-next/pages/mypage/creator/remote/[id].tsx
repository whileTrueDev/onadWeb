import Paper from '@material-ui/core/Paper';
import { GetStaticProps, GetStaticPropsContext, GetStaticPaths } from 'next';
import axios from '../../../../utils/axios';
import RemotePageBannerTable from '../../../../components/mypage/creator/remotePage/remotePageBannerTable';
import HOST from '../../../../config';

interface RemotePageProps {
  params: string;
}

const RemotePage = ({ params }: RemotePageProps): JSX.Element => {
  return (
    <Paper>
      <RemotePageBannerTable pageUrl={params} />
    </Paper>
  );
};

export default RemotePage;

function getCorrectUrl(url: string): string {
  return url.startsWith('/') ? url.replace('/', '') : url;
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const pageUrl = await axios.get(`${HOST}/creator/remote/page-url`);
  // console.log(pageUrl.data);
  // const thisUrl = getCorrectUrl(pageUrl.data);
  // const paths = [{ params: { id: thisUrl } }];
  const paths = [{ params: { id: 'YcU2IP7q' } }];

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (ctx: GetStaticPropsContext) => {
  return {
    props: {
      params: ctx.params?.id,
    },
  };
};
