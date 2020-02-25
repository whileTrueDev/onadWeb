# RESTful API?

> REST = Representational State Transfer
> API  = Application Programming Interface

## API?

소프트웨어의 **기능들을 활용할 수 있도록 만드는 제어장치**.
개발자들이 데이터와 상호작용 하기 위한 인터페이스.

ex. 캠페인을 생성(create), 캠페인 목록을 조회(read), 캠페인을 변경(update), 캠페인을 삭제(delete)..

## REST?

- 2000년도, **Roy Fielding**의 박사학위 논문에서 최초로 소개된 개념.
- 로이필딩은 HTTP 를 만든 사람중 하나.
- 기존에 구축되어 있는 웹상의 **자원들을 망가뜨리지 않고** HTTP를 진보시킬 수 있을까? 를 해결하기 위해 **REST**구조를 제안
- *REST : 웹의 장점을 최대한 활용할 수 있는 구조*

### REST 구성

- Resource 자원: URI
- Verb 행위: HTTP Method
- Representations 표현

### REST를 만족하기 위한 규약(제한사항) + REST 의 특징

1. **클라이언트 / 서버 구조로 나뉘어야 함.**
  클라이언트 / 서버 역할의 구분으로 서로간의 의존성 약화가능  

2. **무 상태성 (Stateless)** 
  작업을 위한 상태정보(세션, 쿠키 등)를 별도로 저장하거나 관리하지 않고, 들어오는 요청만을 단순히 처리하여야 한다.  

3. **캐시처리 (Cashable)**
  클라이언트가 서버로부터 받은 응답을 캐싱할수 있어야 한다.  
  -> REST는 HTTP 표준을 그대로 사용하기 때문에, 웹에서의 인프라를 그대로 사용이 가능하다. 따라서 HTTP의 캐시기능을 그대로 적용 가능하므로, 기본적으로 만족되는 규약임. (Last-Modified태그, E-Tag를 이용)  
  -> (잘 관리되는 캐싱은 클라이언트-서버 간 상호작용을 부분적으로 또는 완전하게 제거하여 scalability와 성능을 향상시킨다.)  

4. **인터페이스의 일관성 (Uniform Interface)**
  URI로 리소스를 식별할 수 있어야 한다: (/campaign, /banner, /notification, etc)  
  HTTP메소드를 통한 표현으로, 자원을 조작할 수 있어야 한다: (GET, POST, PUT, DELETE, PATCH, etc.)  
  메시지는 스스로 설명 가능해야한다. (self-descriptive): 메시지 본문의 형태를 헤더에 서술.(Content-Type: application/json) - JSON의 경우 키값이 의미하는 바를 설명없이는 모르기 때문에 Documentation 명세가 꼭 필요하다.  

5. **계층형 구조**
  REST 서버는 여러 계층으로 구성될 수 있다. 로드밸런싱, 암호화 계층등을 추가해 유연성을 둘 수 있다.

6. **Code on demend (optional)**
  자바스크립트를 통해 서버가 클라이언트로 실행할 수 있는 로직을 전송해 기능을 확장 할 수 있어야 한다

1, 2, 3, 5 는 HTTP 통신을 사용하는 경우 기본적으로 만족이 된다. **중요한 것은 4번**.

### REST의 목표

- **확장 가능성**: 기존에 구축되어 있는 자원들(ex. 구축된 서버들)을 망가뜨리지 않고 진보된 기능을 추가할 수 있다
- **독립적 진화**: **서버-클라이언트가 독립적으로 존재**하여, 서버의 기능이 업데이트 되어도 클라이언트를 업데이트 할 필요가 없도록.
- 인터페이스의 범용성: 일관화된 형식을 통해 쉽게 이해가능
- *계층구조를 통한 보안강화, 응답지연감소*

## REST API

- REST 구조를 따르는 API
- REST구조를 잘 따른다 = RESTful하다.
- RESTful API = REST구조를 잘 따르는 API

### RESTful API 만들기

#### 꼭! 기억할 두 가지

**첫 번째**, URI는 정보의 자원(리소스)을 표현해야 한다. (only 명사)
**두 번째**, 자원에 대한 행위는 HTTP Method(GET, POST, PUT, DELETE)로 표현한다.

예) **캠페인 생성시의 RESTful API의 URI(=api endpoint)**

- 자원 : 캠페인 = campaign
- 행위 : 생성 = POST

잘못된 방식: `GET /campgin/push`
올바른 방식: `POST /campaign`

예) **캠페인 삭제**

- 자원 : 캠페인 = campaign
- 행위 : 삭제 = DELETE

잘못된 방식: `POST /campaign/delete`
올바른 방식: `DELETE /campaign`

예) **캠페인 업데이트(수정)**

- 자원 : 캠페인 = campaign
- 행위 : 수정 = PUT

잘못된 방식: `POST /campaign/update`
올바른 방식: `PUT /campaign`

#### 올바른 HTTP Method

| METHOD | 역할     |
| ------ | ------ |
| GET    | 데이터 조회 |
| POST   | 데이터 생성 |
| PUT    | 데이터 수정(데이터 전체를 갈아 끼우기) |
| PATCH  | 데이터 수정(데이터의 부분만 변경) |
| DELETE | 자원 삭제  |

해당 규칙을 지키지 않은 API = REST API가 아닌, just HTTP API

#### 주의 및 참고할 점

1. URI에 슬래시 구분자(/)는 계층 관계를 나타내는 데 사용
  ex. /campaign/
2. U밑줄(_)은 URI에 사용하지 않는다
3. URI 경로에 하이픈(-)은 URI 가독성을 높이는데 사용
4. URI 경로에는 소문자가 적합하다.
5. 파일 확장자는 URI에 포함시키지 않는다.
  REST API에서는 메시지 바디 내용의 포맷을 나타내기 위한 파일 확장자를 URI 안에 포함시키지 않습니다. Accept header를 사용하도록 합시다.

#### 올바른 응답 코드

| 상태코드 | 의미                                                                                                                |
| ---- | ----------------------------------------------------------------------------------------------------------------- |
| 200  | 클라이언트의 요청을 정상적으로 수행함                                                                                              |
| 201  | 클라이언트가 어떠한 리소스 생성을 요청, 해당 리소스가 성공적으로 생성됨(POST를 통한 리소스 생성 작업 시)                                                    |
| 400  | 클라이언트의 요청이 부적절 할 경우 사용하는 응답 코드                                                                                    |
| 401  | 클라이언트가 인증되지 않은 상태에서 보호된 리소스를 요청했을 때 사용하는 응답 코드(로그인 하지 않은 유저가 로그인 했을 때, 요청 가능한 리소스를 요청했을 때)                        |
| 403  | 유저 인증상태와 관계 없이 응답하고 싶지 않은 리소스를 클라이언트가 요청했을 때 사용하는 응답 코드(403 보다는 400이나 404를 사용할 것을 권고. 403 자체가 리소스가 존재한다는 뜻이기 때문에) |
| 405  | 클라이언트가 요청한 리소스에서는 사용 불가능한 Method를 이용했을 경우 사용하는 응답 코드                                                              |
| 429  | 시간내에 너무 많은 요청이 들어온 경우. (Too many Requests)                                                                        |
| 301  | 클라이언트가 요청한 리소스에 대한 URI가 변경 되었을 때 사용하는 응답 코드(응답 시, Location header에 변경된 URI를 적어줘야한다.)                              |
| 500  | 서버에 문제가 있을 경우 사용하는 응답 코드                                                                                          |

## REST API 의 인증체계

## REST API 의 페이징처리

## REST API 의 부분응답 (Partial Response)

## REST API 의 버저닝

---
references:
[REST API 제대로 알고 사용하기 - TOAST Meetup](https://meetup.toast.com/posts/92)  
[Youtube:NaverD2:DEVIEW2017 - 그런 REST API로 괜찮은가](https://www.youtube.com/watch?v=RP_f5dMoHFc&t=1s)  
[Wikipedia - REST](https://ko.wikipedia.org/wiki/REST)  
[RESTful API 설계 가이드 - 이상학의블로그](https://sanghaklee.tistory.com/57)  
[조대협의 블로그 - REST API 디자인 가이드 - version1](https://bcho.tistory.com/914)
[조대협의 블로그 - REST API 개념 잡기](https://bcho.tistory.com/953)
[조대협의 블로그 - REST API 디자인 가이드 - version2](https://bcho.tistory.com/954)
[조대협의 블로그 - REST API 보안 가이드](https://bcho.tistory.com/955)
[JWT(JSON Web Token)로 로그인 REST API 만들기](https://www.a-mean-blog.com/ko/blog/Node-JS-API/_/JWT-JSON-Web-Token-%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-REST-API-%EB%A7%8C%EB%93%A4%EA%B8%B0)