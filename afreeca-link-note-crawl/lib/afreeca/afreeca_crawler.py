from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time


class AfreecaNoteCrawler:
    afreeca_login_url = 'https://login.afreecatv.com/afreeca/login.php'
    afreeca_link_note_url = 'http://note.afreecatv.com/app/index.php?page=recv_list&nPageNo=0&nListPerPage=50&nNoteCategory=0'

    def __init__(self, driver_path, db_controller, config):
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

        # Driver 설정
        self.driver = webdriver.Chrome(
            driver_path, options=self.driver_options)

        self.login_id = config.AFREECA_LOGIN_ID
        self.password = config.AFREECA_LOGIN_PASSWORD

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
            # 쪽지 내용
            note_contents = note.find_element(By.CLASS_NAME, 'memo_cnt').text
            # 쪽지 개별 보기 url
            note_url = note.find_element(
                By.CLASS_NAME, 'memo_cnt').get_attribute('href')
            # 쪽지 생성 시간
            created_at = note.find_element(By.CLASS_NAME, 'time').text

            result.append({
                "username": username,
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

    def start(self):
        # 아프리카 로그인 창으로 이동
        self.__go_login_page()
        # 아프리카 로그인 작업
        self.__do_login()

        # 아프리카 쪽지 창으로 접속
        self.__go_note_page()

        # 아프리카 쪽지 목록
        notes = self.__do_note_fetch()

        print(notes)

        # 개별 쪽지 읾음 처리
        self.__do_note_read(notes)

        time.sleep(1)
