/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';
import { MarketerInfo, useMarketerProfile } from '../utils/hooks/query/useMarketerProfile';

export interface MarketerInfoContextValue {
  user?: MarketerInfo;
  loading: boolean;
  refetchUnSafely: () => void;
}
export const defaultValue: MarketerInfoContextValue = {
  user: undefined,
  loading: false,
  refetchUnSafely: () => {},
};

// *******************************************************
// 네비바 프로필 사진 동시 변경을 위한 컨텍스트
export const MarketerInfoContext = createContext<MarketerInfoContextValue>(defaultValue);

export function MarketerInfoContextProvider(props: any): JSX.Element {
  const { children } = props;
  const marketerInfo = useMarketerProfile();

  return (
    <MarketerInfoContext.Provider
      value={{
        user: marketerInfo.data,
        loading: marketerInfo.isLoading,
        refetchUnSafely: marketerInfo.refetch,
      }}
    >
      {children}
    </MarketerInfoContext.Provider>
  );
}

export default MarketerInfoContext;
