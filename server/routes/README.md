# OnAD의 Resources

## GET

### 필요한 기능 (GET) - common

- 계약된 크리에이터 가져오기
- 총 배너 노출 수
- 총 배너 클릭 수

### 필요한 기능 (GET) - marketer

- 마케터 광고 ON/OFF 상태
- 마케터 캐시 잔액
- 마케터 총 소진 비용
- 마케터 운용 중 캠페인 수
- 마케터 송출 크리에이터 수
- 마케터 활동 내역
- 마케터의 캠페인 목록
  각 캠페인 정보
- 마케터 비용 차트 데이터
- 마케터 광고 송출 데이터
  광고 송출한 크리에이터 정보
- 마케터 배너 목록 정보
  각 배너 정보
- 마케터 URL링크 목록 정보
  각 URL 정보
- 마케터 유저정보
- 마케터 사업자 등록증
- 마케터 환불계좌정보
- 마케터 세금계산서 발급 내역
- 마케터 충전내역
- 마케터 환불처리 내역
- 마케터 알림 목록 정보
- 크리에이터 목록 및 분석 정보

### 필요한 기능 (GET) - creator

- 크리에이터 수익금 정보
- 크리에이터 광고 수익 차트 데이터
- 크리에이터 내 광고페이지 정보
- 크리에이터 배너 오버레이URL정보
- 크리에이터 배너 목록 정보
  현재 송출중 배너 정보
- 크리에이터 광고 송출 배너 내역 정보
- 크리에이터 유저정보
  계좌정보
  유저정보
- 크리에이터 출금 신청내역 목록
- 크리에이터 알림 목록 정보

## POST

### 필요한 기능 (POST) - common

- 문의메일 생성하기(문의메일보내기)

### 필요한 기능 (POST) - marketer

- 캠페인 생성
- 배너 생성
- 랜딩URL 생성
- 사업자 등록증 등록
- 환불계좌 등록
- 캐시 충전

### 필요한 기능 (POST) - creator

- 출금 신청 등록
- 계좌 등록

## PUT

### 필요한 기능 (PUT) - marketer

- 마케터 광고 ON/OFF 변경
- 캠페인 활성화/비활성화 변경
- 캠페인 정보 변경
  예산
  캠페인명
- 마케터 유저정보 변경
  이름
  비밀번호
  이메일
  전화번호
- 사업자 등록증 변경
- 환불 계좌 변경
- 알림내용 읽음으로 변경

### 필요한 기능 (PUT) - creator

- 사용 IP 변경
- 온애드 계약정보 변경
- 광고페이지 배경이미지 변경
- 광고페이지 소개글 변경
- 광고페이지 라이트/다크모드 변경
- 알림내용 읽음으로 변경

## DELETE

### 필요한 기능 (DELETE) - marketer

- 캠페인 삭제
- 배너 삭제
- 랜딩URL 삭제
- 유저 삭제(탈퇴)

# URI

1. /campaign
2. /banner
3. /notification
4. /notice
5. /marketer
6. /creator
7. /alimtalk
8. /chart
9. /auth
  [JWT-JSON-Web-Token-로-로그인-REST-API-만들기](https://www.a-mean-blog.com/ko/blog/Node-JS-API/_/JWT-JSON-Web-Token-%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-REST-API-%EB%A7%8C%EB%93%A4%EA%B8%B0)