from modules import crawler
from modules import query_modules
from os.path import join, dirname, abspath
import os
from dotenv import load_dotenv
import pandas as pd
import time
import datetime

ROOT_PATH = dirname(abspath(__file__))
UNIX_CHROME_DRIVER_PATH = join(ROOT_PATH, 'chromedriver')
dotenv_path = join(ROOT_PATH, '.env')

if (os.environ.get('PYTHON_ENV') != 'production'):
    load_dotenv(verbose=True)

col_list = ['costType', 'marketerId', 'creatorId', 'browser',
            'device', 'browser_version', 'browser_engine', 'browser_engine_version', 'channel']
while True:
    try:
        now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        print('%s crawling 시작' % now)

        number_of_row = query_modules.get_number_of_row()
        crawling_result = crawler.adpick_crawler(
            number_of_row, UNIX_CHROME_DRIVER_PATH)  # 엑셀 다운로드 및 referrer 리스트 얻음

        referrer_list = crawling_result['referrer_list']
        stop = crawling_result['stop']
        difference = crawling_result['difference']
        time.sleep(2)
        if(stop):
            raise NotImplementedError
        path_dir = join(ROOT_PATH, 'xlsx')
        file_list = os.listdir(path_dir)
        latest_file = sorted(file_list)[-1]

        data_xls = pd.read_excel(
            join(path_dir, '{dir}'.format(dir=latest_file)), 'Worksheet', index_col=None)
        data_xls['creatorTwitchId'] = referrer_list
        data_xls.drop(['날짜', '시간대', 'Referer', '상태'], axis=1, inplace=True)
        data_xls[col_list] = pd.DataFrame(
            [['CPA', 'adpick', '', '', '', '', '', '', 'adpage']], index=data_xls.index)
        data_xls.rename(columns={'링크코드': 'linkId', 'Offer': 'campaignId', '시간': 'conversionTime',
                                 '수익': 'payout', '캠페인': 'campaignName', 'Device': 'os',
                                 'Version': 'os_version'}, inplace=True)
        data_xls['clickedTime'] = data_xls['conversionTime']
        reorder_cols = [
            'costType',
            'clickedTime',
            'conversionTime',
            'linkId',
            'campaignId',
            'campaignName',
            'marketerId',
            'creatorId',
            'creatorTwitchId',
            'IP',
            'device',
            'os',
            'os_version',
            'browser',
            'browser_version',
            'browser_engine',
            'browser_engine_version',
            'payout',
            'channel'
        ]
        data_xls = data_xls[reorder_cols]  # column 순서 변경
        products_list = data_xls[:difference].values.tolist()
        query_modules.do_insert(products_list)
        print('크롤링 / DB 입력완료')
        creator_twitch_id = query_modules.get_creatorTwitchId()
        creator_id_data = query_modules.get_creatorId(creator_twitch_id)
        query_modules.update_creatorId(creator_id_data)
        print('creatorId 입력완료')
        print('--전체 작업 완료--')
        break
    except NotImplementedError as e:
        print('새로 발생한 cpa 없음 / db insert 없이 종료')
        print(e)
        break
    except AttributeError as e:
        print('crawling error retry')
        print(e)
        time.sleep(3)
        continue
