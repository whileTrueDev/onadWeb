# REACT - Typescript

## 문제점

 1. 컴포넌트 중, 색상을 #a3fd33 등과 같이 사용하는 경우가 있어, 색상의 통일성이 부족해짐.

 2. 입력 폼 관련된 문제들이 지속적으로 등장함. 또한 성능에 있어 더 효율적일 필요 있음

 3. 여러 prop 을 하위로 넘겨주고, 여러 컴포넌트를 거쳐내려가게 되는 불편함(prop drilling)을 해소할 필요가 있음.

 4. prop에 대한 타입정의가 없음. prop-types 사용하지 않는 습관, defaultProps 설정하지 않는 습관. 이로 인해 생기는 여러 버그들이 많았음. 또한, propTypes에 설정함으로써 얻는 이득 (prop정보가 vscode 자동완성에 표시됨 등..)을 얻을 수 없음. (type을 설정하는 조금의 시간으로 얻는 이득 > type을 설정하지 않아 얻는 좌절감, 오류)

 5. API 서버에 여러 요청을 보내는데, 모두 같은 데이터형의 응답을 보내오지 않고, 각기 엔드포인트마다 응답의 형태가 다르다. 따라서 각 요청마다 다른 데이터 처리방식이 생기고 복잡성을 증대시킨다.

 6. API 서버에 보내는 요청또한 각자 다르다. use~~~ 훅은 사용하는 경우도있고, axios.~~~ 로 직접 요청을 보내는 경우도 있다. => 혼잡, 혼란을 야기한다.

 7. Paper, Card와 같은 컨테이너들의 경우 CircularProgress 로 로딩중UI 표현하는 경우 로딩중 UI와 로딩 이후 실제 UI의 height 차이에 따라 화면이 버벅거리는 모습이 종종 보여짐.
ex. 크리에이터 대시보드 - 내계정,  크리에이터 대시보드 - 내배너

## 해결책

 1. makeStyles, withStyles 를 사용하여 스타일링을 적용하고, 색상의 경우 theme.palette 에 있는 색상만 사용한다.
 2. react-hooks-form 라이브러리 사용하여 입력폼 컴포넌트 재 생성
    - material-ui 의 input 관련 컴포넌트들과 함께 사용 가능 (react-hook-form은 ref를 통한 입력태그를 제어하는 방식, material-ui의 입력컴포넌트들의 inputRef 에 적용 가능)
    - 참고 : **[react-hook-form 한국어 홈페이지](https://react-hook-form.com/kr/)**
 3. React의 context API 등을 사용하여 해소하는 방식으로 진행.
    - 참고 : **[React Context API](https://ko.reactjs.org/docs/context.html)**
 4. Typescript를 도입하여 propTypes가 아닌 TS의 타입정의를 활용하는 방식으로 prop의 타입을 체크하고, defaultProp을 설정한다.
    - 매 컴포넌트마다 prop에 대한 interface를 지정하여 다른 개발자가 확인하여도 대략적으로 어떤 prop인지 확인 할 수 있도록 한다. **가능하다면 prop이 하는 일을 주석으로 명시!!..**
    - defaultProp을 함수 기본인자로 설정한다.
    - 참고 : [리액트 + 타입스크립트 함께쓰기](https://velog.io/@velopert/create-typescript-react-component)
 5. 통일성있는 API서버로부터의 응답을 정의한다. (API 서버에서 생성한 룰대로.)
 6. 통일성있는 API서버로의 데이터 요청을 정의한다.
    - useFetchData, useDeleteData, useUpdateData 등의 hook이 커버하지 못하는 경우를 제외하고는, hook을 사용하여 API 서버와 통신하도록 수정한다.
    - (API 서버에서 생성한 룰대로. - REST API rule에 근거하여 + API key를 통한 요청 유효성 검사)
 7. 카드, Paper와 같은 컨테이너 역할의 컴포넌트의 경우 Skeleton을 활용한 로딩 표현으로 정립.
데이터 자체에 대한 로딩 표현은 CircularProgress.