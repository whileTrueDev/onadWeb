export interface Session {
  userType: 'creator' | 'marketer';
  creatorId?: string;
  creatorDisplayName?: string;
  creatorName?: string;
  creatorMail?: string;
  creatorLogo?: string;
  creatorIp?: string | string[];
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
