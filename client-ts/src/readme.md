# Atomic Design 차용한 리액트 프로젝트 구조

[(영문)Atomic Desing 이란?](https://bradfrost.com/blog/post/atomic-web-design/)  
[(한글)Atomic Desing 이란?](https://brunch.co.kr/@ultra0034/63)  

- atoms: 재사용이 가능한 최소단위의 컴포넌트를 모아두는 폴더.  
  다른 어떤 컴포넌트도 import해서는 안됨. atoms의 다른 컴포넌트를 참고한다면 그것은 organisms임.  
  material-ui를 래핑하는 atoms컴포넌트는 material-ui컴포넌트 만을 import.  

- organisms: atom들의 모음으로 이룬 하나의 기능 단위 컴포넌트를 모아두는 폴더.  
- pages: organism들의 모음으로 이룬 전체적 페이지 배치 레이아웃 컴포넌트를 모아두는 폴더.  
  데이터 요청을 여기에서, organisms로 뿌려준다. ( 전체 페이지 로딩도 함께 관리 )  
  prop drilling 문제.. 해결방법 생각 -> redux쓴다??
  
- assets: 디자인 관련 파일(css, 디자인 전역 변수, 등등) 폴더.  
- config: 환경설정값이 있는 폴더.  
- utils: axios, pdfgenerator, 등등 필요한 함수 및 모듈이 들어 있는 폴더.  
- utils/hooks: react hooks 폴더.  

## Theme

[Mui Theme 기본 형태](https://material-ui.com/customization/default-theme/#default-theme)  
[Mui Theme palette 기본 색상](https://material-ui.com/customization/palette/)  

### onad palette 색상 오버라이딩

| 색상      | light                                                       | main                                                        | dark                                                        |
| --------- | ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| primary   | ![](https://placehold.it/15/26c6da/000000?text=+) `#26c6da` | ![](https://placehold.it/15/00acc1/000000?text=+) `#2771ff` | ![](https://placehold.it/15/0097a7/000000?text=+) `#0097a7` |
| secondary | ![](https://placehold.it/15/ffb74d/000000?text=+) `#ffb74d` | ![](https://placehold.it/15/ff9800/000000?text=+) `#ff9800` | ![](https://placehold.it/15/f57c00/000000?text=+) `#f57c00` |
| info      | ![](https://placehold.it/15/78909c/000000?text=+) `#78909c` | ![](https://placehold.it/15/455a64/000000?text=+) `#455a64` | ![](https://placehold.it/15/37474f/000000?text=+) `#37474f` |
| warning   | ![](https://placehold.it/15/f6a5c0/000000?text=+) `#f6a5c0` | ![](https://placehold.it/15/f48fb1/000000?text=+) `#f48fb1` | ![](https://placehold.it/15/aa647b/000000?text=+) `#aa647b` |
| error     | ![](https://placehold.it/15/e57373/000000?text=+) `#e57373` | ![](https://placehold.it/15/f44336/000000?text=+) `#f44336` | ![](https://placehold.it/15/d32f2f/000000?text=+) `#d32f2f` |
| success   | ![](https://placehold.it/15/81c784/000000?text=+) `#81c784` | ![](https://placehold.it/15/4caf50/000000?text=+) `#4caf50` | ![](https://placehold.it/15/388e3c/000000?text=+) `#388e3c` |

### 배경색

| 배경                    | 변수                               | 라이트테마                                                  | 다크테마                                                    |
| ----------------------- | ---------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| 뒷 배경                 | `theme.palette.background.default` | ![](https://placehold.it/15/fff/000000?text=+) `#fff`       | ![](https://placehold.it/15/303030/000000?text=+) `#303030` |
| 페이퍼,카드 등 컨테이너 | `theme.palette.background.paper`   | ![](https://placehold.it/15/fafafa/000000?text=+) `#fafafa` | ![](https://placehold.it/15/424242/000000?text=+) `#424242` |

### 배경이 아닌 흰색, 검은색이 필요할 때

`theme.palette.common.white`: `#000`
`theme.palette.common.black`: `#fff`

### 회색

`theme.palette.grey[인덱스]`

| 인덱스 | 50:                                               | 100:                                              | 200:                                              | 300:                                              | 400:                                              | 500:                                              | 600:                                              | 700:                                              | 800:                                              | 900:                                              | A100:                                             | A200:                                             | A400:                                             | A700:                                             |
| ------ | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| 색상   | ![](https://placehold.it/15/fafafa/000000?text=+) | ![](https://placehold.it/15/f5f5f5/000000?text=+) | ![](https://placehold.it/15/eeeeee/000000?text=+) | ![](https://placehold.it/15/e0e0e0/000000?text=+) | ![](https://placehold.it/15/bdbdbd/000000?text=+) | ![](https://placehold.it/15/9e9e9e/000000?text=+) | ![](https://placehold.it/15/757575/000000?text=+) | ![](https://placehold.it/15/616161/000000?text=+) | ![](https://placehold.it/15/424242/000000?text=+) | ![](https://placehold.it/15/212121/000000?text=+) | ![](https://placehold.it/15/d5d5d5/000000?text=+) | ![](https://placehold.it/15/aaaaaa/000000?text=+) | ![](https://placehold.it/15/303030/000000?text=+) | ![](https://placehold.it/15/616161/000000?text=+) |

### 텍스트 색상

`theme.palette.text`

| 변수      | 라이트테마색상     | 다크테마색상             |
| --------- | ------------------ | ------------------------ |
| primary   | `rgba(0,0,0,0.87)` | `#fff`                   |
| secondary | `rgba(0,0,0,0.54)` | `rgba(255,255,255,0.7)`  |
| disabled  | `rgba(0,0,0,0.38)` | `rgba(255,255,255,0.5)`  |
| hint      | `rgba(0,0,0,0.87)` | `rgba(255,255,255,0.5)`  |
| icon      | 없음               | `rgba(255,255,255,0.12)` |

### active, selected, hover, disabled 색상

`theme.palette.action.active`  
`theme.palette.action.selected`  
`theme.palette.action.hover`  
`theme.palette.action.disabled`  

### 그림자

`theme.palette.shadows[인덱스 0 ~ 24]`

### Divider

borderTop 등을 이용해 divider 처럼 사용하는 경우 => `theme.palette.divider`