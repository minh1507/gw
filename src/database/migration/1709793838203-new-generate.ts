import { MigrationInterface, QueryRunner } from "typeorm";

export class NewGenerate1709793838203 implements MigrationInterface {
    name = 'NewGenerate1709793838203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` datetime(6) NULL, \`isFixed\` tinyint NOT NULL DEFAULT 0, \`code\` varchar(25) NOT NULL, \`name\` varchar(100) NOT NULL, \`description\` varchar(1000) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`password\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` datetime(6) NULL, \`isFixed\` tinyint NOT NULL DEFAULT 0, \`hash\` varchar(60) NULL, \`accountId\` int NULL, UNIQUE INDEX \`REL_788ad078f364bbc19eaf78e63e\` (\`accountId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`account\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` datetime(6) NULL, \`isFixed\` tinyint NOT NULL DEFAULT 0, \`username\` varchar(100) NOT NULL, \`fullname\` varchar(100) NOT NULL, \`phoneNumber\` varchar(15) NULL, \`roleId\` int NULL, UNIQUE INDEX \`IDX_41dfcb70af895ddf9a53094515\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`password\` ADD CONSTRAINT \`FK_788ad078f364bbc19eaf78e63ea\` FOREIGN KEY (\`accountId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`account\` ADD CONSTRAINT \`FK_77bf26eef8865441fb9bd53a364\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`account\` DROP FOREIGN KEY \`FK_77bf26eef8865441fb9bd53a364\``);
        await queryRunner.query(`ALTER TABLE \`password\` DROP FOREIGN KEY \`FK_788ad078f364bbc19eaf78e63ea\``);
        await queryRunner.query(`DROP INDEX \`IDX_41dfcb70af895ddf9a53094515\` ON \`account\``);
        await queryRunner.query(`DROP TABLE \`account\``);
        await queryRunner.query(`DROP INDEX \`REL_788ad078f364bbc19eaf78e63e\` ON \`password\``);
        await queryRunner.query(`DROP TABLE \`password\``);
        await queryRunner.query(`DROP TABLE \`role\``);
    }

}
