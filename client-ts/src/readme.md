# Atomic Design 차용한 리액트 프로젝트 구조

[(영문)Atomic Desing?](https://bradfrost.com/blog/post/atomic-web-design/)
[(한글)Atomic Desing?](https://brunch.co.kr/@ultra0034/63)

atoms: 재사용이 가능한 최소단위의 컴포넌트 폴더. (Material-ui를 래핑하지않고 그대로 쓰는 경우도 atom에 해당함.)
organisms: atom들의 모음으로 이룬 하나의 기능 단위 컴포넌트 폴더.
pages: organism들의 모음으로 이룬 전체적 페이지 배치 레이아웃. (데이터 요청)
