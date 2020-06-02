from modules import crawler
from modules import db_insert
from os.path import join, dirname
import os
from dotenv import load_dotenv
import pandas as pd
import time
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(verbose=True)

col_list = ['costType', 'marketerId', 'creatorId', 'os_version', 'browser',
            'device', 'browser_version', 'browser_engine', 'browser_engine_version', 'channel']
while True:
    try:
        referrer_list = crawler.adpick_crawler()  # 엑셀 다운로드 및 referrer 리스트 얻음
        time.sleep(3)
        path_dir = './xlsx'
        file_list = os.listdir(path_dir)

        data_xls = pd.read_excel(
            './xlsx/{dir}'.format(dir=file_list[0]), 'Worksheet', index_col=None)
        data_xls['creatorTwitchId'] = referrer_list
        data_xls.drop(['날짜', '시간대', 'Referer', '상태'], axis=1, inplace=True)
        data_xls[col_list] = pd.DataFrame(
            [['CPA', 'adpick', '', '', '', '', '', '', '', 'adpage']], index=data_xls.index)
        data_xls.rename(columns={'링크코드': 'linkId', 'Offer': 'campaignId', '시간': 'conversionTime',
                                 '수익': 'payout', '캠페인': 'campaignName', 'Device': 'os'}, inplace=True)
        reorder_cols = [
            'costType',
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
        data_xls = data_xls[reorder_cols]
        products_list = data_xls.values.tolist()
        db_insert.do_insert(products_list)
        print('크롤링 / DB 입력완료')
        creator_twitch_id = db_insert.get_creatorTwitchId()
        creator_id_data = db_insert.get_creatorId(creator_twitch_id)
        db_insert.update_creatorId(creator_id_data)
        print('작업완료')
        break
    except ValueError:
        print('발생 CPA 없음')
        break
    except AttributeError:
        print('crawling error retry')
        time.sleep(5)
        continue
    else:
        print('other error')
        print(e)
        break
