import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import HOST from '../../config';
import axiosInstance from '../axios';

export interface UsePaginatedGetRequestObject<T> {
  data?: T[];
  loading: boolean;
  handlePage: (page: number) => void;
  handleBackPage: () => void;
  handleNextPage: () => void;
  request: (newParam?: any) => Promise<AxiosResponse<T[]>>;
  requestWithoutConcat: (newParam?: any) => Promise<AxiosResponse<T[]>>;
  setData: React.Dispatch<React.SetStateAction<T[] | undefined>>;
}
export interface PagenatedGetRequestOption {
  offset?: number;
  firstPage?: number;
  disableConcat?: boolean;
}
export default function usePaginatedGetRequest<T = any>(
  url: string,
  options?: PagenatedGetRequestOption,
): UsePaginatedGetRequestObject<T> {
  let offset = 2;
  let firstPage = 0;
  let disableConcat = false;

  if (options) {
    if (options.offset) offset = options.offset;
    if (options.firstPage) firstPage = options.firstPage;
    if (options.disableConcat) disableConcat = options.disableConcat;
  }
  // 캠페인목록 크기
  const OFFSET = offset;

  // 로딩
  const [loading, setLoading] = useState<boolean>(false);
  // 데이터
  const [data, setData] = useState<T[]>();
  // 요청 페이지
  const [page, setPage] = useState(firstPage);
  function handleBackPage(): void {
    setPage(p => p - 1);
  }
  function handleNextPage(): void {
    setPage(p => p + 1);
  }
  function handlePage(targetPage: number): void {
    setPage(targetPage);
  }

  /**
   * 기존 데이터에 덧붙이는 방식의 데이터 요청
   */
  const request = useCallback((): Promise<AxiosResponse<T[]>> => {
    setLoading(true);
    return axiosInstance
      .get<T[]>(`${HOST}${url}`, { params: { offset: OFFSET, page } })
      .then(res => {
        setLoading(false);
        setData(prev => {
          if (!prev) return res.data;
          return prev.concat(res.data);
        });
        return res;
      })
      .catch(err => {
        setLoading(false);
        throw err;
      });
  }, [OFFSET, page, url]);

  /**
   * 기존 데이터에 덧붙이지 않는 방식의 데이터 요청
   */
  const requestWithoutConcat = useCallback((): Promise<AxiosResponse<T[]>> => {
    setLoading(true);
    return axiosInstance
      .get<T[]>(`${HOST}${url}`, { params: { offset: OFFSET, page } })
      .then(res => {
        setLoading(false);
        setData(prev => {
          if (!prev) return res.data;
          return res.data;
        });
        return res;
      })
      .catch(err => {
        setLoading(false);
        throw err;
      });
  }, [OFFSET, page, url]);

  useEffect(() => {
    if (disableConcat) requestWithoutConcat();
    else request();
  }, [disableConcat, request, requestWithoutConcat]);

  return {
    loading,
    data,
    handleBackPage,
    handleNextPage,
    request,
    requestWithoutConcat,
    setData,
    handlePage,
  };
}
