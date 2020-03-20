export default interface AdPageData {
  creatorTwitchId: string;
  creatorDesc: string;
  creatorBackgroundImage: string;
  creatorTheme: 'dark' | 'light';
  visitCount: number;
  level: number;
  exp: number;
  clickCount: number;
  transferCount: number;
};

export interface AdPagePatchParamAndRes {
  creatorBackgroundImage?: string;
  creatorDesc?: string;
  creatorTheme?: 'dark' | 'light';
}
