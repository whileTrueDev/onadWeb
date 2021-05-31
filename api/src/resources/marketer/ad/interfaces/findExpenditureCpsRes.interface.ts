export interface FindExpenditureCpsResQueryResult {
  date: string;
  amount: number;
}
export interface FindExpenditureCpsResObj {
  date: string;
  value: number;
  type: '클릭' | '판매';
}
export type FindExpenditureCpsRes = FindExpenditureCpsResObj[];
