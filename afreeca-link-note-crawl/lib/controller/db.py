class DBController:
    def __init__(self, data_access_object):
        self.dao = data_access_object

    def __do_query(self, query, query_dict={}):
        '''
        db query => fetchAll 함수  
        :query: {string} 디비 쿼리, 동적인 데이터는 :data이름 으로 넣는다.  
        :query_dict: {dict} 디비 쿼리 딕셔너리 동적인 데이터를 넣는 경우 키:값으로 매핑하는 딕셔너리
        '''
        rows = self.dao.execute(query, query_dict).fetchall()
        return rows


    def select_link_cert(self):
        from db.member import AfreecaLinkCertification

        return self.dao.query(AfreecaLinkCertification).filter_by(certState = 0).all()
