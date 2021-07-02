import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatorInfoDeletedFlag1624929406609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`ALTER TABLE creatorInfo ADD COLUMN deleteFlag BOOL DEFAULT 0 NOT NULL `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('ALTER TABLE creatorInfo DROP deleteFlag');
  }
}
