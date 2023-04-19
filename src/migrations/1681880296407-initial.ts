import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1681880296407 implements MigrationInterface {
  name = 'initial1681880296407';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "dob" TIMESTAMP NOT NULL DEFAULT now(), "avatar" character varying, "address" character varying, "phone" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "userProfileId" uuid NOT NULL, "refreshToken" text, "role" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_4c8f96ccf523e9a3faefd5bdd4c" UNIQUE ("email"), CONSTRAINT "UQ_eb3be2a3be5c4e424ed040e9778" UNIQUE ("refreshToken"), CONSTRAINT "REL_9aceb41cc18e0aa023e7734949" UNIQUE ("userProfileId"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" character varying NOT NULL, "authorId" uuid NOT NULL, "previewImage" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_9aceb41cc18e0aa023e77349491" FOREIGN KEY ("userProfileId") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_9aceb41cc18e0aa023e77349491"`,
    );
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(`DROP TABLE "user_profile"`);
  }
}
