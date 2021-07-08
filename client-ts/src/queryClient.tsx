import { QueryCache, QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 요청 실패시, 1회 재요청
      refetchOnWindowFocus: false, // 브라우저에 포커싱될 때마다 refetch 하는지 => 필요한 데이터만 on 하도록.
      refetchOnMount: false, // 컴포넌트 마운트시마다 refetch 하는지 => 필요한 데이터만 on 하도록.
      staleTime: 1000 * 60 * 5, // 쿼리된 데이터를 만료상태로 간주하는 임계시간 ms
    },
  },
  queryCache: new QueryCache(),
});

export default queryClient;
