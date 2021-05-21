# API server on Nestjs

## Description

기존에 존재하는 Express 서버에 /v2 엔드포인트를 생성한 뒤, Nest를 순차적으로 도입하고자 했으나,

1. 그렇게 사용되는 예시가 없는 점
2. 순차적 도입에는 대개 진행이 제대로 되지 않는다는 점
3. 프론트 코드에서 요청시 /v2 엔드포인트 입력처리 등이 필요한 점
4. 두 코드가 섞여있는 것이 더 어지러워, 관리가 더 어려운 점

등에 의해 Nest 버전으로 rewrite 하는 방식으로 가는 것이 향후 프로젝트 관리에 있어 더 좋을 것이라 판단하였음.

### Nestjs 프로젝트 정보

1. 기존 트루포인트와는 다르게 `src/entities`에 모든 엔터티 클래스를 모아둔다.

    → `typeorm-model-generator` 사용하여 기존 DB의 모든 테이블을 typeorm 엔터티 클래스로 구성함

2. 모든 interface, dto는 shared 모듈 만들지 않고, API 프로젝트 내부에 구성.

    → `shared` 모듈을 함께 제작하는 방향은 그 크기가 더 크다고 판단.
    → 1차적으로 Nestjs로 옮기는 작업이후 향후 공유가 필요한 코드를 `shared` 로 빼는 작업을 다시 진행하는 것이 낫다.

3. 기존 DB query 의 처리
    1. 기본적으로는 모든 쿼리를 typeorm repository 방식으로 변경.
    2. 어느정도 복잡한 쿼리에 queryBuilder 활용 가능.
    3. 쿼리빌더 활용하여도 변경하기 힘든 경우, 기존 쿼리를 그대로 사용.
4. test코드의 작성

    nest-cli (`nest g resource`, `nest g controller`, ...) 로 생성시 작성되는 테스트 코드를 그대로 둔다.

    → 테스트 코드 작성을 함께 진행시, 크기가 크다고 판단. 향후 테스트 코드 구성.

5. 컨트롤러 엔드포인트의 처리

    → 기존 express 엔드포인트를 1도 다름없이 똑같이 가져간다.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

