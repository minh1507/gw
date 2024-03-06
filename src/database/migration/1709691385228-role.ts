import { MigrationInterface, QueryRunner } from 'typeorm';

export class Role1709691385228 implements MigrationInterface {
  name = 'Role1709691385228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` datetime(6) NULL, \`isFixed\` tinyint NOT NULL DEFAULT 0, \`code\` varchar(25) NOT NULL, \`name\` varchar(100) NOT NULL, \`description\` varchar(1000) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`role\``);
  }
}
