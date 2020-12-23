from os.path import abspath, join, dirname
import sys
import os
from lib.afreeca import afreeca_crawler
from lib.controller.db import DBController
from db.dbmanager import DBManager
from config.config_loader import ConfigLoader

ROOT_PATH = dirname(abspath(__file__))


def get_driver_path():
    '''
    드라이버 위치 구하기
    '''
    if sys.platform == 'darwin':
        return join(ROOT_PATH, 'driver', 'darwin', 'chromedriver')
    elif sys.platform == 'win32':
        return join(ROOT_PATH, 'driver', 'windows', 'chromedriver.exe')


def run():
    # *****************************************************
    # environment variables 설정
    config = ConfigLoader()
    config.init()
    config.load()

    # *****************************************************
    # DB 설정
    db_url = "mysql+pymysql://%s:%s@%s:%s/%s?charset=%s" % (
        config.DB_USER, config.DB_PASSWORD,
        config.DB_HOST, config.DB_PORT,
        config.DB_DATABASE, config.DB_CHARSET
    )
    dao = DBManager.initialize(db_url)
    DBManager.initialize_db()

    # DB 컨트롤러 인스턴스 생성
    db_controller = DBController(dao)

    # *****************************************************
    # 크롤러 인스턴스 생성
    DRIVER_PATH = get_driver_path()
    af = afreeca_crawler.AfreecaNoteCrawler(DRIVER_PATH, db_controller, config)

    # 크롤러 시작
    af.start()


if __name__ == '__main__':
    run()
