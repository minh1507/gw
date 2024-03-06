import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import CommonHelper from '../common/util/sys.util';

// meta data for entities of system
const entitiesPath = CommonHelper.pathConfig('module');

let dataEnv: any = null;
if (fs.existsSync(`.env`)) {
  dataEnv = dotenv.parse(fs.readFileSync(`.env`));
}
export const env = dataEnv;
export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  name: 'mysql',
  charset: 'utf8mb4_bin',
  type: dataEnv?.DATABASE_TYPE || process.env.DATABASE_TYPE,
  host: dataEnv?.DATABASE_HOST || process.env.DATABASE_HOST,
  port:
    parseInt(dataEnv?.DATABASE_PORT, 10) ||
    parseInt(String(process.env.DATABASE_PORT)),
  username: dataEnv?.DATABASE_USER || process.env.DATABASE_USER,
  password: dataEnv?.DATABASE_PASSWORD || process.env.DATABASE_PASSWORD,
  database: dataEnv?.DATABASE_NAME || process.env.DATABASE_NAME,
  timezone: 'Z',
  entities: [entitiesPath],
  synchronize: false,
  logging: ['error'],
  seeds: ['src/database/seed/**/main.seed{.ts,.js}'],
  migrations: ['dist/database/migration/**/*{.ts,.js}'],
  logger: 'debug',
};

export const dataSource = new DataSource(dataSourceOptions);
