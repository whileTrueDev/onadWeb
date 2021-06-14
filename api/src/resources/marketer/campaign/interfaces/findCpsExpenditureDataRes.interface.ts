export interface FindCpsExpenditureDataObj {
  createdAt: string;
  amount: number;
}

export interface FindCpsExpenditureDataResObj {
  date: string;
  value: number;
  type: '클릭' | '판매';
}

export type FindCpsExpenditureDataRes = FindCpsExpenditureDataResObj[];
