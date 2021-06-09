import { InternalServerErrorException } from '@nestjs/common';
import { Connection, QueryRunner } from 'typeorm';

export type transactionQueryCallback<ReturnT> = (queryRunner: QueryRunner) => Promise<ReturnT>;
export type transactionQueryOptions = {
  errorMessage?: string;
};
/**
 * 트랜잭션 쿼리를 실행합니다. 콜백함수에 쿼리 실행문이 포함되어야 합니다.
 * @param connection typeorm 커넥션
 * @param callback 트랜잭션 적용할 쿼리 모음을 실행하는 콜백함수. 이 콜백함수의 첫번째 인자인 queryRunner를 통해 모든 쿼리가 실행되어야 합니다.
 * 또한, 이 콜백함수의 리턴값이 transactionQuery 함수의 리턴값이 됩니다.
 * @param options -> errorMessage? 커스텀 에러메시지 디버그를 위해 작성하는 것이 좋습니다.
 * @returns 제네릭
 */
export const transactionQuery = async <T = any>(
  connection: Connection,
  callback: transactionQueryCallback<T>,
  options?: transactionQueryOptions,
): Promise<T> => {
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const result = await callback(queryRunner);
    await queryRunner.commitTransaction();
    return result;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    if (options?.errorMessage) {
      console.error(`[ERROR transactionQuery] ${options.errorMessage} - `, err);
    }
    console.error(`[ERROR transactionQuery] - `, err);
    throw new InternalServerErrorException();
  } finally {
    await queryRunner.release();
  }
};
