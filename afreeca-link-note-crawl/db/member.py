from sqlalchemy import Column, String, Integer
from sqlalchemy.sql.expression import func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.sqltypes import TIMESTAMP

Base = declarative_base()


class AfreecaLinkCertification:
    """
    id: 고유값
    creatorId: 온애드 크리에이터 고유 ID
    tempCode: 임시발행 인증코드
    certState: 인증 상태 (인증진행중, 인증완료, 인증실패)
    afreecaId: 인증을 진행하고자 하는 아프리카 ID
    createdAt: 생성 날짜
    """
    __tablename__ = 'afreecaLinkCertification'
    id = Column(Integer, primary_key=True, autoincrement=True)
    creatorId = Column(String(50), unique=False)
    tempCode = Column(String(50), unique=True)
    certState = Column(String(50))
    afreecaId = Column(String(50))
    createdAt = Column(TIMESTAMP, default=func.now())
