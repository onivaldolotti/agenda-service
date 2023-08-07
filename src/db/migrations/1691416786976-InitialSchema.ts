import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1691416786976 implements MigrationInterface {
  name = 'InitialSchema1691416786976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "scheduling" ("id" SERIAL NOT NULL, "appointments" jsonb NOT NULL, "date" date NOT NULL, "professional_id" integer, CONSTRAINT "PK_a19510fdc2c3f1c9daff8b6e395" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "professional" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "phone_number" character varying NOT NULL, "work_start_time" TIME NOT NULL, "work_end_time" TIME NOT NULL, CONSTRAINT "PK_2846b0dcaac01f9983cb719f124" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "duration_minutes" integer NOT NULL, CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduling" ADD CONSTRAINT "FK_e474aac33ae7d33b0098ebc62ba" FOREIGN KEY ("professional_id") REFERENCES "professional"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scheduling" DROP CONSTRAINT "FK_e474aac33ae7d33b0098ebc62ba"`,
    );
    await queryRunner.query(`DROP TABLE "service"`);
    await queryRunner.query(`DROP TABLE "professional"`);
    await queryRunner.query(`DROP TABLE "scheduling"`);
  }
}
