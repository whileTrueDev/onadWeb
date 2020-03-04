# Atomic Design 차용한 리액트 프로젝트 구조

[(영문)Atomic Desing 이란?](https://bradfrost.com/blog/post/atomic-web-design/)  
[(한글)Atomic Desing 이란?](https://brunch.co.kr/@ultra0034/63)  

- atoms: 재사용이 가능한 최소단위의 컴포넌트 폴더.  
 다른 어떤 컴포넌트도 import해서는 안됨. 다른 컴포넌트를 참고한다면 그것은 organisms임.  
 material-ui를 래핑하는 atoms컴포넌트는 material-ui컴포넌트 만을 import.  

- organisms: atom들의 모음으로 이룬 하나의 기능 단위 컴포넌트 폴더.  
- pages: organism들의 모음으로 이룬 전체적 페이지 배치 레이아웃.  
  데이터 요청을 여기에서, organisms로 뿌려준다. ( 전체 페이지 로딩도 함께 관리 )  

- assets: 디자인 관련 파일(css, 디자인 전역 변수, 등등) 폴더.  
- config: 환경설정값이 있는 폴더.  
- utils: axios, pdfgenerator, 등등 필요한 함수 및 모듈이 들어 있는 폴더.  
- utils/hooks: react hooks 폴더.  

## Theme

[Mui Theme 기본 형태](https://material-ui.com/customization/default-theme/#default-theme)  
[Mui Theme palette 기본 색상](https://material-ui.com/customization/palette/)  

### onad palette 색상 오버라이딩

| 색상        | light                                                                    | main                                                                     | dark                                                                     |
| --------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| primary   | #26c6da                                                                  | <div style="width: 30px; height: 30px; background-color: #00acc1"></div> | <div style="width: 30px; height: 30px; background-color: #0097a7"></div> |
| secondary | <div style="width: 30px; height: 30px; background-color: #ffb74d"></div> | <div style="width: 30px; height: 30px; background-color: #ff9800"></div> | <div style="width: 30px; height: 30px; background-color: #f57c00"></div> |
| info      | <div style="width: 30px; height: 30px; background-color: #78909c"></div> | <div style="width: 30px; height: 30px; background-color: #455a64"></div> | <div style="width: 30px; height: 30px; background-color: #37474f"></div> |
| warning   | <div style="width: 30px; height: 30px; background-color: #f6a5c0"></div> | <div style="width: 30px; height: 30px; background-color: #f48fb1"></div> | <div style="width: 30px; height: 30px; background-color: #aa647b"></div> |
| error     | <div style="width: 30px; height: 30px; background-color: #e57373"></div> | <div style="width: 30px; height: 30px; background-color: #f44336"></div> | <div style="width: 30px; height: 30px; background-color: #d32f2f"></div> |
| success   | <div style="width: 30px; height: 30px; background-color: #81c784"></div> | <div style="width: 30px; height: 30px; background-color: #4caf50"></div> | <div style="width: 30px; height: 30px; background-color: #388e3c"></div> |

### 배경색

| 배경            | 변수                                 | 라이트테마                                                                    | 다크테마                                                                     |
| ------------- | ---------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| 뒷 배경          | `theme.palette.background.default` | <div style="width: 30px; height: 30px; background-color: #fff"></div>    | <div style="width: 30px; height: 30px; background-color: #fafafa"></div> |
| 페이퍼,카드 등 컨테이너 | `theme.palette.background.paper`   | <div style="width: 30px; height: 30px; background-color: #424242"></div> | <div style="width: 30px; height: 30px; background-color: #303030"></div> |

### 배경이 아닌 흰색, 검은색이 필요할 때

`theme.palette.common.white`: #000
`theme.palette.common.black`: #fff

### 회색

`theme.palette.grey[인덱스]`

| 인덱스 | 50:                                                                     | 100:                                                                    | 200:                                                                    | 300:                                                                    | 400:                                                                    | 500:                                                                    | 600:                                                                    | 700:                                                                    | 800:                                                                    | 900:                                                                    | A100:                                                                   | A200:                                                                   | A400:                                                                   | A700:                                                                   |
| --- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 색상  | <div style="background-color: #fafafa; width:30px; height:30px;"></div> | <div style="background-color: #f5f5f5; width:30px; height:30px;"></div> | <div style="background-color: #eeeeee; width:30px; height:30px;"></div> | <div style="background-color: #e0e0e0; width:30px; height:30px;"></div> | <div style="background-color: #bdbdbd; width:30px; height:30px;"></div> | <div style="background-color: #9e9e9e; width:30px; height:30px;"></div> | <div style="background-color: #757575; width:30px; height:30px;"></div> | <div style="background-color: #616161; width:30px; height:30px;"></div> | <div style="background-color: #424242; width:30px; height:30px;"></div> | <div style="background-color: #212121; width:30px; height:30px;"></div> | <div style="background-color: #d5d5d5; width:30px; height:30px;"></div> | <div style="background-color: #aaaaaa; width:30px; height:30px;"></div> | <div style="background-color: #303030; width:30px; height:30px;"></div> | <div style="background-color: #616161; width:30px; height:30px;"></div> |

### 텍스트 색상

`theme.palette.text`

| 변수        | 라이트테마색상                                                                         | 다크테마색상                                                                                                   |
| --------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| primary   | <div style="background-color: rgba(0,0,0,0.87); width:30px; height:30px;"></div> | <div style="background-color: #333; color: #fff; width:30px; height:30px;">글자</div>                      |
| secondary | <div style="background-color: rgba(0,0,0,0.54); width:30px; height:30px;"></div> | <div style="background-color: #333; color: rgba(255,255,255,0.7); width:30px; height:30px;">글자</div>     |
| disabled  | <div style="background-color: rgba(0,0,0,0.38); width:30px; height:30px;"></div> | <div style="background-color: #333; color: rgba(255,255,255,0.5); width:30px; height:30px;">글자</div>     |
| hint      | <div style="background-color: rgba(0,0,0,0.87); width:30px; height:30px;"></div> | <div style="background-color: #333; color: rgba(255,255,255,0.5); width:30px; height:30px;">글자</div>     |
| icon      | 없음                                                                               | <div style="background-color: #424242; color: rgba(255,255,255,0.12); width:30px; height:30px;">글자</div> |

### active, selected, hover, disabled 색상

`theme.palette.action.active`
`theme.palette.action.selected`
`theme.palette.action.hover`
`theme.palette.action.disabled`

### 그림자

`theme.palette.shadows[인덱스 0 ~ 24]`