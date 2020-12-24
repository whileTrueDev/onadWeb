from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time
import requests
import logging


class AfreecaNoteCrawler:
    CERT_STATE_DEFAULT = 0
    CERT_STATE_VERIFIED = 1
    CERT_STATE_DENIED = 2
    afreeca_login_url = 'https://login.afreecatv.com/afreeca/login.php'
    afreeca_link_note_url = 'http://note.afreecatv.com/app/index.php?page=recv_list&nPageNo=0&nListPerPage=50&nNoteCategory=0'
    bjapi_url = 'https://bjapi.afreecatv.com/api'
    bjapi_header = {"User-Agent": "Mozilla/5.0"}

    def __init__(self, driver_path, db_controller, config, logger):
        # logger 설정
        self.logger = logger

        # config 객체
        self.config = config
        # DB 컨트롤러
        self.db_controller = db_controller

        # Driver 옵션 설정
        self.driver_options = webdriver.ChromeOptions()
        # self.driver_options.add_argument('headless')
        self.driver_options.add_argument('disable-gpu')
        self.driver_options.add_argument('--no-sandbox')
        self.driver_options.add_argument('--mute-audio')

        self.logger.info('크롬드라이버 생성 시작')
        # Driver 설정
        self.driver = webdriver.Chrome(
            driver_path, options=self.driver_options)

        self.login_id = config.AFREECA_LOGIN_ID
        self.password = config.AFREECA_LOGIN_PASSWORD
        self.logger.info('크롬드라이버 생성 완료')

    def __go_login_page(self):
        self.driver.get(self.afreeca_login_url)
        time.sleep(1)

    def __do_login(self):
        # 아이디
        uid = self.driver.find_element_by_id('uid')
        uid.clear()
        uid.send_keys(self.login_id)

        # 비밀번호
        password = self.driver.find_element_by_id('password')
        password.clear()
        password.send_keys(self.password)

        # 로그인
        password.send_keys(Keys.RETURN)

        time.sleep(5)

    def __go_note_page(self):
        self.driver.get(self.afreeca_link_note_url)
        time.sleep(1)

    def __do_note_fetch(self):
        result = []
        # 읽지 않은 쪽지 목록을 가져온다.
        unread_notes = self.driver.find_elements_by_class_name('read')

        # 쪽지 하나씩 데이터를 가져온다
        for note in unread_notes:
            # 유저 이름. 형식 => 닉네임 (ID)
            username = note.find_element(By.ID, 'ict').text
            nickname = username.split(' (')[0]
            afreecaId = username.split(' (')[1].replace(")", "")

            # 쪽지 내용
            note_contents = note.find_element(By.CLASS_NAME, 'memo_cnt').text
            # 쪽지 개별 보기 url
            note_url = note.find_element(
                By.CLASS_NAME, 'memo_cnt').get_attribute('href')
            # 쪽지 생성 시간
            created_at = note.find_element(By.CLASS_NAME, 'time').text

            result.append({
                "username": username,
                "afreecaId": afreecaId,
                "nickname": nickname,
                "note_contents": note_contents,
                "note_url": note_url,
                "created_at": created_at,
            })

        time.sleep(1)
        return result

    def __do_note_read(self, notes):
        for note in notes:
            self.driver.get(note.get('note_url'))
            time.sleep(2)

    def __call_bjapi_station(self, afreecaId):
        res = requests.get(
            self.bjapi_url + '/' + afreecaId + '/station', headers=self.bjapi_header)

        if res.status_code == 200:
            afreeca_data = res.json()
            logo = "https:" + afreeca_data['profile_image']
            nickname = afreeca_data['station']['user_nick']

            return {"logo": logo, "nickname": nickname}
        else:
            raise Exception('bjapi 요청에 실패하였습니다.')

    def __check_code(self, notes):
        # DB의 인증코드 리스트 # afreecaLinkCertification 객체가 온다.
        cert_list = self.db_controller.select_link_cert()

        # 인증완료 인증 row 목록
        verified_note_list = []
        verified_cert_list = []
        for item in cert_list:
            for note in notes:
                if item.afreecaId == note['afreecaId'] and item.tempCode in note['note_contents']:
                    # 온애드에서 연동 신청한 afreecaId와 동일한 Id를 가지며 내용에 인증코드가 있는 경우
                    # 인증 성공 상태로 변경
                    item.certState = self.CERT_STATE_VERIFIED

                    # 인증된 DB 연동 인증 정보
                    verified_cert_list.append(item)
                    # 인증된 쪽지
                    verified_note_list.append(note)

        if len(verified_cert_list) > 0:
            for verified_cert in verified_cert_list:

                # 인증된 유저 정보의 afreecaId 연동 작업
                verified_user = self.db_controller.get_user(
                    verified_cert.creatorId)

                # #########################
                # bjapi 요청 및 유저 정보를 creatorInfo로 업데이트
                afreeca_info = self.__call_bjapi_station(
                    verified_cert.afreecaId)

                verified_user.afreecaId = verified_cert.afreecaId
                verified_user.afreecaName = afreeca_info['nickname']
                verified_user.afreecaLogo = afreeca_info['logo']

            # 인증 상태 변경 / 유저 아프리카 Id 변경 DB에 적용
            self.db_controller.commit()

        return verified_note_list

    def start(self):
        # 로거 설정
        self.__set_logger()

        # 아프리카 로그인 창으로 이동
        self.__go_login_page()

        # 아프리카 로그인 작업
        self.__do_login()

        # 아프리카 쪽지 창으로 접속
        self.__go_note_page()

        # 아프리카 쪽지 목록 데이터 가져오기
        notes = self.__do_note_fetch()

        # 아프리카 연동인증 요청과 쪽지창을 비교
        verified_notes = self.__check_code(notes)

        # 개별 쪽지 읾음 처리
        self.__do_note_read(verified_notes)

        time.sleep(1)
