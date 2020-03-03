# Atomic Design 차용한 리액트 프로젝트 구조

[(영문)Atomic Desing 이란?](https://bradfrost.com/blog/post/atomic-web-design/)
[(한글)Atomic Desing 이란?](https://brunch.co.kr/@ultra0034/63)

atoms: 재사용이 가능한 최소단위의 컴포넌트 폴더. (Material-ui를 래핑하지않고 그대로 쓰는 경우도 atom에 해당함.)
organisms: atom들의 모음으로 이룬 하나의 기능 단위 컴포넌트 폴더.
pages: organism들의 모음으로 이룬 전체적 페이지 배치 레이아웃. (데이터 요청)

assets: 디자인 관련 파일(css, 디자인 전역 변수, 등등) 폴더.
config: 환경설정값이 있는 폴더.
utils: axios, pdfgenerator, 등등 필요한 함수 및 모듈이 들어 있는 폴더.
utils/hooks: react hooks 폴더.

## Theme

[Mui Theme 기본 형태](https://material-ui.com/customization/default-theme/#default-theme)
[Mui Theme palette 기본 색상](https://material-ui.com/customization/palette/)

### onad palette 색상 오버라이딩

|색상| light | main | dark |
|-----|------|------|------|
|primary|<div style="width: 30px; height: 30px; background-color: #26c6da"></div>|<div style="width: 30px; height: 30px; background-color: #00acc1"></div>| <div style="width: 30px; height: 30px; background-color: #0097a7"></div>|
|secondary|<div style="width: 30px; height: 30px; background-color: #ffb74d"></div>|<div style="width: 30px; height: 30px; background-color: #ff9800"></div>|<div style="width: 30px; height: 30px; background-color: #f57c00"></div>|
|info|<div style="width: 30px; height: 30px; background-color: #78909c"></div>|<div style="width: 30px; height: 30px; background-color: #455a64"></div>|<div style="width: 30px; height: 30px; background-color: #37474f"></div>|
|warning|<div style="width: 30px; height: 30px; background-color: #f6a5c0"></div>|<div style="width: 30px; height: 30px; background-color: #f48fb1"></div>|<div style="width: 30px; height: 30px; background-color: #aa647b"></div>|
|error|<div style="width: 30px; height: 30px; background-color: #e57373"></div>|<div style="width: 30px; height: 30px; background-color: #f44336"></div>|<div style="width: 30px; height: 30px; background-color: #d32f2f"></div>|
|success|<div style="width: 30px; height: 30px; background-color: #81c784"></div>|<div style="width: 30px; height: 30px; background-color: #4caf50"></div>|<div style="width: 30px; height: 30px; background-color: #388e3c"></div>|
