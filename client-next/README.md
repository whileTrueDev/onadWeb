# client-ts > client-next rewriting

기존 client-ts에 client side 코드들을
next.js를 기반으로 재구축

next에 cra migration을 하지 않고 초기 빌딩부터 CNA로 빌딩

연동서버는 api, 프론트는 client-next로

서버 시동은 기존과 동일,
프론트 시동도 기존과 동일

~~~bash
./client-next

# 개발환경
> yarn dev

# 빌드
> yarn build

# 빌드 실행
> yarn start
~~~

## Client-next 구조
```bash
├── assets                  : 외부 자원 - 다운로드 폰트
│   ├── fonts               
├── atoms                   : Material-UI 기반 커스텀 컴포넌트
│   ├── table
│   ├── avatar
│   └── ...
├── components              : 각 page 하위 구성 컴포넌트들
│   ├── mainpage            
│   ├── mypage
│   ├── shared
│   └── temp
├── config                  : 설정값
├── constants               : 공유 상수값
├── context                 : 마케터 컨텍스트
├── pages                   : 라우팅 페이지
│   ├── introduction
│   ├── mypage
│   ├── policy
│   └── ...
├── public                  : 이미지 및 manifest 등 구성자원
│   ├── creatorList
│   ├── door
│   └── ...
├── source                  : 메인페이지 사용 텍스트
├── store                   : zustand-store
├── style                   : 글로벌 CSS 및 메인페이지 CSS
│   ├── mainpage
│   └── ...
├── utils                   : utils 관련 파일
│   ├── aws
│   ├── hooks
│   └── ...
├── next.config.js          : next.js 환경설정
├── theme.tsx               : 공유 테마 파일
└── tsconifg.json           : 프로젝트 typescript 설정
``` 

