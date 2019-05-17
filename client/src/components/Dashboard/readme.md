# Dashboard 폴더 구조

## 전체적 구조 설명

- /assets : style 관련 폴더, 주로 css, jss  
- /components : views 에서 사용될 작은 단위의 컴포넌트들 모음 폴더  
- /layouts : Dashboard의 큰 레이아웃, Dashboard의 시작점  
- /variables : 차트 데이터 또는 보여주어야 할 데이터 파일이 있는 폴더  
- /views : 실제 클라이언트에게 보이는 파일들이 있는 폴더, /components 에서 컴포넌트를 가져와 사용한다.  
- routes.jsx : 라우팅을 위한 배열이 선언되어 있음.  

## assets

Css 파일, 대시보드에 기본적으로 필요한 이미지, react용 css (jss) 파일을 두는 style 관련 폴더

### assets/css

`onad.css` : dashboard의 전체적 css가 들어있는 파일  

### assets/img

sidebar, 회사 로고등의 이미지 파일이 들어있는 곳   (express서버에서 사용하는 방식으로 변경 고려)  

- `assets/img/faces` : 계정관리 탭의 user avatar 사진  

### assets/jss

아래의 components 폴더의 각 컴포넌트들에게 적용되는 각 컴포넌트 용 스타일 jss 의 모음 폴더

`onad.jsx` : 전체적인 색상, 그림자, transition 등이 정의되어있고, assets/jss/onad 폴더에서 색상들을 대개 불러와 사용한다.

### assets/jss/onad

`tooltipStyle.jsx` : 마우스를 위에 올릴 시 나타나는 tooltip 들에 대한 스타일 정의 파일  
`dropdownStyle.jsx` : notification 클릭 시 나타나는 dropdown 에 대한 스타일 정의 파일  
`checkboxAndRadioStyle.jsx` : 체크박스와 radio 버튼에 대한 스타일 정의 파일  
`cardImagesStyles.jsx` : 사용되지 않음. (제거 요망)

### assets/jss/onad/components

Dashboard/components 폴더의 각 컴포넌트 들의 스타일이 정의되어 있음

### assets/jss/onad/layouts

Dashboard/layouts 폴더의 각 컴포넌트 들의 스타일이 정의되어 있음

### assets/jss/onad/views

Dashboard/views 폴더의 각 컴포넌트 들의 스타일이 정의되어 있음

## components

Dashboard/views 폴더에서 사용될 컴포넌트들, material-ui 의 각 컴포넌트들을 가져와 커스터마이징한 것들의 모음.

## layouts

대시보드의 시작점 파일이 들어있는 폴더, assets/css/onad.css 가 적용되는 위치.

## variables

차트 데이터 또는 보여주어야 할 데이터 파일이 있는 폴더.  
백엔드에서 데이터를 가져오는 식으로 변경되어야 하므로 필요가 없을 시 삭제 요망

## views

실제 클라이언트에게 보이는 뷰단의 파일들이 있는 폴더, /components 에서 컴포넌트를 가져와 사용한다. 각 아래 하위 폴더는 사이드바의 탭 단위.