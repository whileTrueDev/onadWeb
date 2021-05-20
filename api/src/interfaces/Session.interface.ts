export type Session = CreatorSession & MarketerSession

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
