# OnAD의 API router 

## URI

1. /chart
2. /creators
3. /banners
4. /mail
5. /marketer
6. /creator
7. /login   (auth폴더)
8. /logout  (auth폴더)

각 엔드포인트에 대한 라우터를 생성한다

### routes 폴더 구조

1. /chart
2. /creators
3. /banners
4. /mail
5. /marketer
6. /creator
7. /auth/login
8. /auth/logout

### 작업 과정

1. 각라우터 생성
2. 안쓰는 메소드 처리(responseHelper.middleware.unusedMethod)
3. 각 라우터의 메소드에 대한 요청처리
  (`responseHelper.checkSessionExists`, `responseHelper.withErrorCatch`, `responseHelper.getParam`, `responseHelper.paramValidationCheck`, `responseHelper.send`  
  요청처리함수 내부에서 에러발생하고싶다 => `import createError from 'http-errors';` 한뒤 `throw new createError[에러코드](에러메시지)`  
  에러메시지는 `./lib/responseMessages` 에 따로 정의해 둔 것이 있으니 참고.
4. swagger 주석 생성 (해당 엔드포인트 router위에 바로 생성)

### 참고점

#### 1. uri의 하위계층이 여럿인경우

ex) marketer/cash | marketer/cash/expenditure | marketer/cash/charge-history | marketer/cash/refund-history  
이런 경우는 하위폴더 cash 생성 이후 cash폴더에 `index.ts` 만들고, /marketer에서 `import cashRouter from './cash';` 한이후 `router.use('/cash', cashRouter);` 로 생성 (해당 라우터에 대한 내용만)

#### 2. '포함관계'의 경우

예를들어,
마케터의 캠페인1에 대한 모든 정보가 필요한 경우 => /marketer/campaign  
마케터의 캠페인1에 대한 활성화/비활성화 정보만 필요한경우 => /marketer/campaign  
그냥 불러와도 안쓴느 데이터가 있어도 이렇게 합시당.

#### 3. 세션 검사 및 안쓰는 메소드 핸들링 방법

예를들어 `/` 엔드포인트에 모든 메소드 **세션검사**가 필요하고, **get메소드만 허락**한다면,

~~~js
router.route('/')
  .all(responseHelper.checkSession) // 모든 메소드에 대해 세션체크
  .get(withErrorCheck((req, res, next) => { responseHelper.send('보낼데이터', res) } )) // 사용하는 메소드 안에서는 무조건  responseHelper.send() 필요
  .all(responseHelper.unusedMethod) //안쓰는 메소드 모두 unsed 표시
~~~

#### 4. session 데이터가 필요한 경우

responseHelper의 `getSessionData` 함수를 사용.

~~~js
router.route('/some-end-point')
  .get((req, res, next) => {
    const session = responseHelper.getSessionData(req);
    const { marketerId } = responseHelper.getSessionData(req);
    const { creatorId } = responseHelper.getSessionData(req);
  })
~~~

---

## 부록

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
  각 캠페인 분석 정보
    지도
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
