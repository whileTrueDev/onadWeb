from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker


class DBManager:
    __engine = None
    __session = None

    @staticmethod
    def initialize(db_url, db_log_flag=False):
        DBManager.__engine = create_engine(db_url, echo=db_log_flag)
        DBManager.__session = scoped_session(sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=DBManager.__engine
        ))

        session = DBManager.__session

        return session

    @staticmethod
    def initialize_db():
        from db.member import Base
        Base.metadata.create_all(bind=DBManager.__engine)

    @staticmethod
    def dispose():
        DBManager.__session.close()
        DBManager.__engine.dispose()
