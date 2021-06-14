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
