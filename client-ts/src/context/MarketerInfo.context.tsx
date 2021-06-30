/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';
import { MarketerInfo } from '../organisms/mypage/marketer/office/interface';
import { useGetRequest } from '../utils/hooks';

export interface MarketerInfoContextValue {
  user?: MarketerInfo;
  loading: boolean;
  doGetRequest: () => void;
}
export const defaultValue: MarketerInfoContextValue = {
  user: undefined,
  loading: false,
  doGetRequest: () => {},
};

// *******************************************************
// 네비바 프로필 사진 동시 변경을 위한 컨텍스트
const MarketerInfoContext = createContext<MarketerInfoContextValue>(defaultValue);

export function MarketerInfoContextProvider(props: any): JSX.Element {
  const { children } = props;
  const marketerInfo = useGetRequest<null, MarketerInfo>('/marketer');

  return (
    <MarketerInfoContext.Provider
      value={{
        user: marketerInfo.data,
        loading: marketerInfo.loading,
        doGetRequest: marketerInfo.doGetRequest,
      }}
    >
      {children}
    </MarketerInfoContext.Provider>
  );
}

export default MarketerInfoContext;
