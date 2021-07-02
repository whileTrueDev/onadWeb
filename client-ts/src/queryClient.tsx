import { QueryCache, QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 브라우저에 포커싱될 때마다 refetch 하는지
      refetchOnMount: false, // 컴포넌트 마운트시마다 refetch 하는지
      staleTime: 1000 * 60 * 5, // 쿼리된 데이터를 만료상태로 간주하는 임계시간 ms
    },
  },
  queryCache: new QueryCache(),
});

export default queryClient;
