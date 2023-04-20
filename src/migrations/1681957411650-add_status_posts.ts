import { MigrationInterface, QueryRunner } from "typeorm";

export class addStatusPosts1681957411650 implements MigrationInterface {
    name = 'addStatusPosts1681957411650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "status"`);
    }

}
