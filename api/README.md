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

## DB 변경사항의 적용

21.06.14 hwasurr(dan)

1. 온애드는 typeorm으로 데이터베이스를 다룹니다.
2. 온애드는 typeorm의 syncronize 기능을 기본적으로 사용하지 않습니다. 따라서 엔터티 파일을 변경하였을 때 그 변경사항이 곧바로 DB에 적용되지 않습니다.
3. 온애드에서의 DB변경사항의 적용은 migration 기능을 활용하여 진행합니다.
4. 온에드에서는 typeormCLI의 migration:generate 기능을 사용하지 않습니다.

### DB 변경사항의 적용 방법

1. `migration:create` 스크립트를 이용해 기본적 마이그레이션 파일을 작성합니다.

    ```bash
    $ yarn migration:create <마이그레이션이름>
    ```

2. `src/migrations` 에 생성된 `<Timestamp>-<마이그레이션이름>.ts` 파일을 확인할 수 있습니다.

    ```ts
    import { MigrationInterface, QueryRunner } from 'typeorm';

    export class CreatorDetailContentMigration1623634408645 implements MigrationInterface {
        // "up" has to contain the code you need to perform the migration
        public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(`ALTER TABLE creatorDetail MODIFY content varchar(255)`);
        }

        // "down" has to revert whatever up changed. down method is used to revert the last migration.
        public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(`ALTER TABLE creatorDetail MODIFY content varchar(50)`);
        }
    }
    ```

3. up메서드에는 변경할 사항에 대한 sql을, down 메서드에는 변경사항을 원래로 되돌리는 사항에 대한 sql을 작성합니다. (내부 변경사항에 대한 sql은 개발자가 직접 작성합니다.)
4. `migration:run` 스크립트를 통해 마이그레이션을 실행합니다.

    ```bash
    $ yarn migration:run
    ```

5. 올바르게 작성했다면, 변경사항이 DB에 적용되고, `onadMigrations` 테이블에 실행된 마이그레이션 클래스명(이 예제에서는 `CreatorDetailContentMigration1623634408645`) 이 생성되어 있는것을 확인합니다. 여기 `onadMigrations` 테이블에 생성된 마이그레이션은 실행된것으로 간주하고, 다음 마이그레이션 작업 실행시 무시됩니다.
6. 방금 적용한 마이그레이션을 되돌리고 싶다면 `migration:revert` 스크립트를 이용할 수 있습니다. `migration:revert` 스크립트는 가장 최근 실행된 마이그레이션의 `down` 메서드 내에 있는 내용을 실행합니다.

    ```bash
    $ yarn migration:revert
    ```

7. 배포 담당자는 production 에 새로운 버전이 배포되기 전에, 새로운 migration을 실행해야합니다.
