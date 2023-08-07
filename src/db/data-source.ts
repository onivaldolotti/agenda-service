import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  // host: process.env.DB_HOST,
  // port: +process.env.DB_PORT,
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_DATABASE,
  // [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*.js'], // [__dirname + '/db/migrations/*.{.ts,.js}'],
  url: process.env.DB_URL,
  ssl: { rejectUnauthorized: false },
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
