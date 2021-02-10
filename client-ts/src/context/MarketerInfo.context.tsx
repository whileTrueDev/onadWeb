/* eslint-disable @typescript-eslint/no-empty-function */
import React, {
  createContext, useCallback, useEffect, useState
} from 'react';
import HOST from '../config';
import { MarketerInfo } from '../organisms/mypage/marketer/office/interface';
import axiosInstance from '../utils/axios';

export interface MarketerInfoContextValue {
  user: MarketerInfo | null;
  doGetRequest: () => void;
}
export const defaultValue: MarketerInfoContextValue = {
  user: null,
  doGetRequest: () => {},
};

// *******************************************************
// 네비바 프로필 사진 동시 변경을 위한 컨텍스트
const MarketerInfoContext = createContext<MarketerInfoContextValue>(
  defaultValue
);

export function MarketerInfoContextProvider(props: any): JSX.Element {
  const { children } = props;
  const [marketerInfo, setMarketerInfo] = useState<MarketerInfo|null>(null);

  const doGetRequest = useCallback(() => {
    axiosInstance.get<MarketerInfo>(`${HOST}/marketer`)
      .then((response) => {
        setMarketerInfo(response.data); // update your state
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  useEffect(() => {
    doGetRequest();
  }, [doGetRequest]);

  return (
    <MarketerInfoContext.Provider value={{ user: marketerInfo, doGetRequest }}>
      {children}
    </MarketerInfoContext.Provider>
  );
}

export default MarketerInfoContext;
