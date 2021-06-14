export interface FindCpsReviewResObj {
  id: number;
  orderId: number;
  authorName: string;
  authorId: string;
  targetCreatorName: string;
  title: string;
  contents: string;
  creatorId: string;
  createDate: string;
  updateDate: string;
  orderPrice: number;
  optionId: number;
  quantity: number;
  status: number;
  merchandiseId: number;
  merchandiseName: string;
  images: string;
  marketerId: string;
}

export type FindCpsReviewRes = FindCpsReviewResObj[];
