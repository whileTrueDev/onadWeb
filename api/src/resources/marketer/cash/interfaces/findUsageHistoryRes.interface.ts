export interface FindUsageHistoryResObj {
  date: string;
  cash: string;
}

export interface FindUsageHistoryMetadata {
  type: 'CPM' | 'CPC';
  cash: string; // number string
}

export type FindUsageHistoryResWithMetadata = {
  metaData: FindUsageHistoryMetadata[];
  data: string[][];
};
