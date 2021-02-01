import os
from dotenv import load_dotenv


class ConfigLoader:
    environment = ''

    def __init__(self):
        self.environment = os.getenv('PYTHON_ENV')

    def init(self):
        if self.environment != 'production':
            load_dotenv(verbose=True)

    def load(self):
        self.DB_HOST = os.getenv('DB_HOST')
        self.DB_USER = os.getenv('DB_USER')
        self.DB_PASSWORD = os.getenv('DB_PASSWORD')
        self.DB_DATABASE = os.getenv('DB_DATABASE')
        self.DB_CHARSET = os.getenv('DB_CHARSET')
        self.DB_PORT = os.getenv('DB_PORT')
        self.DB_LOGFLAG = os.getenv('DB_LOGFLAG')
        self.AFREECA_LOGIN_ID = os.getenv('AFREECA_LOGIN_ID')
        self.AFREECA_LOGIN_PASSWORD = os.getenv('AFREECA_LOGIN_PASSWORD')
