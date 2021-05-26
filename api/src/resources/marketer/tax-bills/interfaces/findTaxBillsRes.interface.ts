export enum TaxBillState {
  '발행대기',
  '발행완료',
  '미발행'
}


export interface FindTaxBillsResObject {
  state: TaxBillState;
  cashAmount: string;
  id: number;
  marketerId: string;
  date: string;
  updateDate: Date;
}

export type FindTaxBillsRes = FindTaxBillsResObject[];