export interface MarketerChargeRes {
  status: 'vbankIssued' | 'success';
  chargedCashAmount?: number | string;
  message?: string;
  vbank_num?: string;
  vbank_date?: string;
  vbank_name?: string;
  vbank_holder?: string;
}
