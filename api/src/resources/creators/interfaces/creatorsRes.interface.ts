export interface CreatorsAnalyzed {
  creatorId: string;
  creatorName: string;
  creatorLogo: string;
  creatorTwitchId: string;
  followers: number;
  content: string;
  openHour: string;
}
export type CreatorsRes = Array<CreatorsAnalyzed>;
