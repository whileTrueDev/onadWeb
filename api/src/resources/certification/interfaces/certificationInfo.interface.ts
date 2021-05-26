export interface CertificationInfo {
  birth: number; // 779554800,
  birthday: string; // '1994-09-15',
  certified: boolean; // true,
  certified_at: number; // 1621990133,
  foreigner: boolean; // false,
  gender: 'male' | 'female'; // 'male',
  imp_uid: string; // 'imp_123456789',
  merchant_uid: string; // '123456-123456',
  name: string; // '홍길동',
  origin: string; // 'http://localhost:3001/regist',
  pg_provider: 'danal'; // 'danal',
  pg_tid: string; // '4312314129583187598123758',
  unique_in_site: string; // 동일사이트 내에서의 본인인증한 유저에 대한 unique한 키
  unique_key: string; // 본인인증한 유저에 대한 언제나 unique한 키
}
