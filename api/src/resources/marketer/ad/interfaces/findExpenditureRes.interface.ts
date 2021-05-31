export interface FindExpenditureResObj {
  date: string;
  value: number;
  type: 'CPS' | 'CPM' | 'CPA' | 'CPC';
}

export type FindExpenditureRes = FindExpenditureResObj[];
