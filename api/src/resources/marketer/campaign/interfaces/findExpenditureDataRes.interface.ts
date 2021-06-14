export interface FindExpenditureDataResObj {
  date: string;
  value: number;
  type: 'CPM' | 'CPC';
}

export type FindExpenditureDataRes = FindExpenditureDataResObj[];
