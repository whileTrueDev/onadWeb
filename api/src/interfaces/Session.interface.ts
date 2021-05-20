export type OnadSession = {
  userType: 'marketer' | 'creator';
} & Omit<MarketerSession, 'userType'> & Omit<CreatorSession, 'userType'>;

export type MarketerSession = {
  userType: 'marketer';
  marketerId?: string;
  marketerMail?: string;
  marketerAccountNumber?: string;
  marketerBusinessRegNum?: string;
  marketerName?: string;
  marketerPhoneNum?: string;
  registered?: boolean;
  marketerPlatformData?: string;
}


export type CreatorSession = {
  userType: 'creator';
  creatorId?: string;
  creatorDisplayName?: string;
  creatorName?: string;
  creatorMail?: string;
  creatorLogo?: string;
  creatorIp?: string | string[];
}
