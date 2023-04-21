import { MigrationInterface, QueryRunner } from "typeorm";

export class updateCommentIdColumnCommentLikesTable1682044063966 implements MigrationInterface {
    name = 'updateCommentIdColumnCommentLikesTable1682044063966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_likes" DROP CONSTRAINT "FK_5347bf7dd013273a5a5fb49b7c7"`);
        await queryRunner.query(`ALTER TABLE "comment_likes" DROP COLUMN "commentsId"`);
        await queryRunner.query(`ALTER TABLE "comment_likes" DROP COLUMN "commentId"`);
        await queryRunner.query(`ALTER TABLE "comment_likes" ADD "commentId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment_likes" ADD CONSTRAINT "FK_abbd506a94a424dd6a3a68d26f4" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_likes" DROP CONSTRAINT "FK_abbd506a94a424dd6a3a68d26f4"`);
        await queryRunner.query(`ALTER TABLE "comment_likes" DROP COLUMN "commentId"`);
        await queryRunner.query(`ALTER TABLE "comment_likes" ADD "commentId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment_likes" ADD "commentsId" uuid`);
        await queryRunner.query(`ALTER TABLE "comment_likes" ADD CONSTRAINT "FK_5347bf7dd013273a5a5fb49b7c7" FOREIGN KEY ("commentsId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
