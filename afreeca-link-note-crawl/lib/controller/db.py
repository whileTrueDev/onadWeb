from db.member import AfreecaLinkCertification
from db.member import CreatorInfo
from db.member import CreatorReferralCodeLogs


class DBController:
    REFERRALCODE_TARGET_STATE = 0
    REFERRALCODE_CALCULATABLE_STATE = 1

    def __init__(self, data_access_object):
        self.dao = data_access_object

    def commit(self):
        self.dao.commit()

    def get_user(self, creatorId):
        return self.dao.query(CreatorInfo).filter_by(creatorId=creatorId).first()

    def select_link_cert(self, certState=0):
        '''
        afreeca link certification 테이블 조회함수.
        @param certState 인증상태 정보. 기본값:0, 0=인증진행중,1=인증완료,2=인증실패
        '''
        return self.dao.query(AfreecaLinkCertification).filter_by(certState=certState).all()

    def delete_link_cert(self, afreecaId, target_time):
        self.dao.query(AfreecaLinkCertification)\
            .filter_by(afreecaId=afreecaId)\
            .filter(AfreecaLinkCertification.createdAt <= target_time)\
            .delete()
        self.dao.commit()

    def update_referral_code(self, creatorId):
        """연동이 완료된 유저의 추천인 코드 상태를 업데이트합니다. 업데이트 이후 commit까지 모두 적용되어있습니다.

        Args:
            creatorId (string): 연동이 완료된 유저의 creatorId
        """
        self.dao.query(CreatorReferralCodeLogs)\
            .filter_by(calculateState=self.REFERRALCODE_TARGET_STATE, creatorId=creatorId)\
            .update({'calculateState': self.REFERRALCODE_CALCULATABLE_STATE})

        self.dao.commit()
