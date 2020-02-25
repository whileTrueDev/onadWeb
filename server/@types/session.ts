export interface CreatorSession {
  userType: 'creator';
  creatorId?: string;
  creatorDisplayName?: string;
  creatorName?: string;
  creatorMail?: string;
  creatorLogo?: string;
  creatorIp?: string | string[];
}

export interface MarketerSession {
  userType: 'marketer';
  marketerId?: string;
  marketerUserType?: string;
  marketerMail?: string;
  marketerAccountNumber?: string;
  marketerBusinessRegNum?: string;
  marketerName?: string;
  marketerPhoneNum?: string;
  registered?: boolean;
  marketerPlatformData?: string;
}
