import { SvgIconProps } from '@material-ui/core';

export interface ManualSelect {
  icon: (props: SvgIconProps) => JSX.Element;
  label: string;
}
export interface Source {
  image: string | null; description: string;
}

export interface ManualContentSources {
  subType?: boolean;
  card: { title: string; subtitle: string };
  selectorImages?: { url: string; title: string }[];
  source?: Source[];
  xsplit?: Source[];
  obs?: Source[];
}

export interface ManualSources {
  selectComponent: ManualSelect[];
  contract: ManualContentSources;
  programSetting: ManualContentSources;
  income: ManualContentSources;
  landing: ManualContentSources;
  adpage: ManualContentSources;
  bannerlist: ManualContentSources;
  withdrawal: ManualContentSources;
}
