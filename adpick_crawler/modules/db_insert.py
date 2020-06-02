import pymysql
from os.path import join, dirname
import os
from dotenv import load_dotenv
import sys
from . import csv_loader

path_dir = './new_csv'
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(verbose=True)

USER_ID = os.environ.get("DB_USER")
PASSWORD = os.environ.get("DB_PASSWORD")
HOST = os.environ.get("DB_HOST")
DB_NAME = os.environ.get("DB_DATABASE")
DB_CHARSET = os.environ.get("DB_CHARSET")
DB_PORT = os.environ.get("DB_PORT")

connection = pymysql.connect(
    user=USER_ID,
    passwd=PASSWORD,
    host=HOST,
    db=DB_NAME,
    charset=DB_CHARSET,
    port=int(DB_PORT)
)


def do_insert(data):
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    insert_query = """
                    INSERT INTO tracking_test (
                    costType, conversionTime, linkId, campaignId, campaignName, marketerId,
                    creatorId, creatorTwitchId, ip, device, os, os_version,
                    browser, browser_version, browser_engine, browser_engine_version, payout, channel
                  ) VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s );"""

    cursor.executemany(insert_query, data)
    connection.commit()
    cursor.close()


def get_creatorTwitchId():
    print('get_creatorTwitchId')
    select_query = """
                    SELECT creatorTwitchId 
                    FROM tracking_test 
                    WHERE DATE_FORMAT(clickedTime, "%Y-%m-%d") = CURDATE();"""
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    cursor.execute(select_query)
    connection.commit()
    cursor.close()
    result = [item['creatorTwitchId']
              for item in cursor.fetchall() if item['creatorTwitchId'] != '-']
    organized_result = list(dict.fromkeys(result))
    return organized_result
    # returns list of twitchId no duplicates


def get_creatorId(creator_twitch_id):
    print('get_creatorId')
    return_data = []
    select_query = """
                    SELECT creatorId 
                    FROM creatorInfo 
                    WHERE creatorTwitchId = %s;
                    """
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    for id in creator_twitch_id:
        cursor.execute(select_query, id)
        connection.commit()
        result = cursor.fetchall()
        print(result)
        try:
            result[0]['creatorTwitchId'] = id
            return_data.append(result[0])
        except Exception as e:
            print(e)
    cursor.close()
    return return_data


def update_creatorId(creator_id_data):
    print('update_creatorId')
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    for id in creator_id_data:
        update_query = """
                    UPDATE tracking_test 
                    SET creatorId = {creatorId}
                    WHERE creatorTwitchId = "{creatorTwitchId}"
                    AND DATE_FORMAT(clickedTime, "%Y-%m-%d") = CURDATE();
                """.format(creatorId=id['creatorId'], creatorTwitchId=id['creatorTwitchId'])
        cursor.execute(update_query)
        connection.commit()
    cursor.close()
