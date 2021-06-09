export interface FindIncomeChartDataResObj {
  date: string;
  cash: number;
  type: 'CPM' | 'CPC';
}
export type FindIncomeChartDataRes = FindIncomeChartDataResObj[];
