from db.member import AfreecaLinkCertification
from db.member import CreatorInfo


class DBController:
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
        