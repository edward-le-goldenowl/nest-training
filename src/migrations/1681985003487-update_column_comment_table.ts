import { MigrationInterface, QueryRunner } from "typeorm";

export class updateColumnCommentTable1681985003487 implements MigrationInterface {
    name = 'updateColumnCommentTable1681985003487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "previewImage"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "previewImage" character varying`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
    }

}
