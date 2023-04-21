import { MigrationInterface, QueryRunner } from "typeorm";

export class removeContentColumnCommentLikesTable1682047233063 implements MigrationInterface {
    name = 'removeContentColumnCommentLikesTable1682047233063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_likes" DROP COLUMN "content"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_likes" ADD "content" character varying NOT NULL`);
    }

}
