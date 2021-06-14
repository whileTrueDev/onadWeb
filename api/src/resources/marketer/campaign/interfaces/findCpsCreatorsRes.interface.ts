export interface FindCpsCreatorsResObj {
  creatorId: string;
  creatorTwitchName: string | null;
  afreecaId: string | null;
  afreecaName: string | null;
  creatorTwitchId: string | null;
  // 판매, 클릭 정보
  soldCount: string | number;
  clickCount: string | number;
  // 분석정보
  contentsGraphData: string | null;
  timeGraphData: string | null;
  contentsGraphDataAfreeca: string | null;
  timeGraphDataAfreeca: string | null;

  // 이전 버전의 리액트 서버에 맞추기 위함
  total_sales_amount: string | number;
  ctr: string | number;
}

export type FindCpsCreatorsRes = FindCpsCreatorsResObj[];
