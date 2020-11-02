from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests
from pyvirtualdisplay import Display
import csv
from bs4 import BeautifulSoup
import sys
from dotenv import load_dotenv
from os.path import join, dirname
import os
import datetime

time = datetime.datetime.now().hour

dotenv_path = join(dirname(__file__), '.env')
if (os.environ.get('PYTHON_ENV') != 'production'):
    load_dotenv(verbose=True)

ADPICK_USER_ID = os.environ.get("ADPICK_MEM_ID")
ADPICK_PASSWORD = os.environ.get("ADPICK_MEM_PWD")

# Add following 2 line before start the Chrome
if(sys.platform == 'win32' or sys.platform == 'darwin'):
    options = webdriver.ChromeOptions()
    options.add_argument('headless')
    options.add_argument('disable-gpu')
    prefs = {
        "download.default_directory": r"C:\Users\kevin\Desktop\adpick_crawler\xlsx\\"}
    options.add_experimental_option("prefs", prefs)
else:
    display = Display(visible=0, size=(800, 800))
    display.start()

    options = webdriver.ChromeOptions()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('headless')
    options.add_argument('disable-gpu')
    prefs = {'download.default_directory': './xlsx'}
    options.add_experimental_option('prefs', prefs)


def adpick_crawler(number_of_row, UNIX_CHROME_DRIVER_PATH):
    csv_list = []
    referrer_list = []
    stop = False
    try:
        if (sys.platform == 'win32'):
            driver = webdriver.Chrome(
                r'C:\Users\kevin\Desktop\adpick_crawler\winwebdriver\chromedriver.exe', options=options)
            driver.implicitly_wait(2)
        else:
            driver = webdriver.Chrome(UNIX_CHROME_DRIVER_PATH, options=options)

        driver.get(
            'https://www.adpick.co.kr/?ac=login&nurl=https%3A%2F%2Fwww.adpick.co.kr%2F%3Fac%3Ddashboard')
        driver.implicitly_wait(2)

        print('adpick enter succeed')

        driver.find_element_by_id('memid').send_keys(ADPICK_USER_ID)  # id 입력
        driver.find_element_by_id('mempwd').send_keys(
            ADPICK_PASSWORD)  # pwd 입력
        print('typing id, pw succeed')

        driver.find_element_by_class_name('btnLogin').click()  # 로그인 버튼 클릭

        print('login succeed')

        # 리포트 페이지 - 전환으로 이동
        driver.get('https://www.adpick.co.kr/?ac=report&tac=details')

        driver.implicitly_wait(2)

        if time == 0:  # 자정일 경우는 어제 데이터를 검색
            # version checkbox True / yesterday data
            driver.get(
                'https://adpick.co.kr/?ac=report&tac=details&offer=&vip=1&vref=1&vdev=1&vver=1&gigan=yesterday')
            driver.implicitly_wait(2)
            print('select yesterday')

        else:
            # version checkbox True / today data
            driver.get(
                'https://adpick.co.kr/?ac=report&tac=details&offer=&vip=1&vref=1&vdev=1&vver=1&gigan=today')
            driver.implicitly_wait(2)
            print('select today')

        referrer_list = []

        while True:
            try:
                wait_for_tbody = WebDriverWait(driver, 10).until(EC.presence_of_element_located(
                    (By.CSS_SELECTOR, "#contents > div.content-inner > div.content_box > div.content_inner.content_report.report_details > div:nth-child(1) > div.om-table-wrap > table > tbody")))

            except Exception as e:
                print(e)
                continue
            req = driver.page_source
            soup = BeautifulSoup(req, 'html.parser')

            tr_list = soup.select('tbody tr')

            for row in tr_list:
                cells = row.find_all('td')
                if(cells[0].text == '진행내역이 없거나 조회범위를 초과했습니다.'):
                    raise NotImplementedError
                for i, cell in enumerate(cells):
                    a_tag = cell.findChildren()
                    if(i == 3):
                        referrer_list.append(a_tag[0])

            if (len(tr_list) == 10):
                index = int(
                    soup.find('div', class_='om-paging paging').find('strong').text[-1])
                if(index == 0):
                    index += 11
                else:
                    index += 1
                driver.find_element_by_class_name(
                    'om-paging').find_elements_by_xpath("./*")[index].click()
                continue
            else:
                break
        referrer_list_length = len(referrer_list)
        print('get tr list succeed')

        # referrer cell 값만 저장
        for i, val in enumerate(referrer_list):
            if('onad.io' in str(val)):  # get a-tag link value
                csv_list.append(val['href'].split('/')[-1])
            elif ('-' in str(val)):  # check empty cell
                csv_list.append(val.text)

        print('get referrer cell list succeed')
        difference = referrer_list_length - number_of_row
        if(difference == 0):
            print('새로 발생한 cpa 없음 / 크롤링 종료')
            stop = True
        else:
            print('새로 발생한 cpa 존재 / 엑셀 다운로드')
            driver.find_elements_by_class_name('btn_myprofile')[
                0].click()  # 엑셀 다운로드 클릭
            driver.implicitly_wait(1)
            print('download xlsx succeed')
        return_dict = {'referrer_list': csv_list,
                       'stop': stop, 'difference': difference}
        driver.close()
        return return_dict

    except NotImplementedError:
        print('오늘 발생한 CPA 없음')
        stop = True
        difference = 0
        return_dict = {'referrer_list': csv_list,
                       'stop': stop, 'difference': difference}
        return return_dict
