import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import HOST from '../../config';
import axiosInstance from '../axios';

export interface PagenatedGetRequestOption {
  offset?: number;
  firstPage?: number;
}
export default function usePaginatedGetRequest<T = any>(
  url: string,
  options?: PagenatedGetRequestOption,
) {
  let offset = 2;
  let firstPage = 0;

  if (options) {
    if (options.offset) offset = options.offset;
    if (options.firstPage) firstPage = options.firstPage;
  }
  // 캠페인목록 크기
  const OFFSET = offset;

  // 로딩
  const [loading, setLoading] = useState<boolean>(false);
  // 데이터
  const [data, setData] = useState<T[]>();
  // 요청 페이지
  const [page, setPage] = useState(firstPage);
  function handleNextPage(): void {
    setPage((p) => p + 1);
  }
  const request = useCallback((): Promise<AxiosResponse<T[]>> => {
    setLoading(true);
    return axiosInstance.get<T[]>(
      `${HOST}${url}`, { params: { offset: OFFSET, page } }
    )
      .then((res) => {
        setLoading(false);
        setData((prev) => {
          if (!prev) return res.data;
          return prev.concat(res.data);
        });
        return res;
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
  }, [OFFSET, page, url]);

  useEffect(() => {
    request();
  }, [request]);

  return {
    loading, data, handleNextPage, request, setData,
  };
}
