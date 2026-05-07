import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteUserField1778165522057 implements MigrationInterface {
    name = 'DeleteUserField1778165522057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
    }

}
