from selenium import webdriver
import requests
from pyvirtualdisplay import Display
import csv
from bs4 import BeautifulSoup
import sys
from dotenv import load_dotenv
from os.path import join, dirname
import os
import time

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(verbose=True)

ADPICK_USER_ID = os.environ.get("ADPICK_MEM_ID")
ADPICK_PASSWORD = os.environ.get("ADPICK_MEM_PWD")

# Add following 2 line before start the Chrome
if(sys.platform == 'win32'):
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


def adpick_crawler(number_of_row):
    csv_list = []
    cell_list = []
    stop = False
    if (sys.platform == 'win32'):
        driver = webdriver.Chrome(
            r'C:\Users\kevin\Desktop\adpick_crawler\winwebdriver\chromedriver.exe', options=options)
        driver.implicitly_wait(2)
    else:
        driver = webdriver.Chrome(
            './webdriver/chromedriver', options=options)

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

    campaign_side_bar = driver.find_element_by_class_name('m3')  # 사이드바 찾기
    campaign_side_bar_ul = campaign_side_bar.find_elements_by_tag_name(
        "ul")  # 사이드바 - ul 찾기
    campaign_side_bar_ul_li = campaign_side_bar_ul[0].find_elements_by_tag_name(
        "li")  # 사이드바 - ul - li 찾기

    campaign_side_bar_ul_li[0].click()  # 리포트 - 캠페인 클릭
    print('report-campaign click')
    driver.implicitly_wait(2)
    driver.find_elements_by_class_name(
        'ui-depth3')[0].find_elements_by_tag_name("li")[2].click()  # navbar-전환 클릭
    driver.implicitly_wait(2)
    print('navbar-transfer')
    driver.find_elements_by_class_name(
        'om-select-custom-select')[0].find_elements_by_tag_name('option')[0].click()  # 오늘 날짜 선택
    driver.implicitly_wait(2)
    print('select today')

    req = driver.page_source
    driver.implicitly_wait(2)

    soup = BeautifulSoup(req, 'html.parser')
    driver.implicitly_wait(2)
    tr_list = soup.find('tbody').find_all()

    # tr들 리스트에서 td들 뽑음
    for row in tr_list:
        cells = row.findChildren('td')
        for i, cell in enumerate(cells):
            td_list = cell.findChildren()
            if(i == 3):
                cell_list.append(td_list[0])
    cell_length = len(cell_list)
    print('get tr list succeed')

    # referrer cell 값만 저장
    for i, val in enumerate(cell_list):
        if('onad.io' in str(val)):  # get a-tag link value
            csv_list.append(val['href'].split('/')[-1])
        elif ('-' in str(val)):  # check empty cell
            csv_list.append(val.text)

    print('get referrer cell list succeed')
    difference = cell_length - number_of_row
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
