import dotenv from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'

import { User } from './users/model/UserEntity'

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

const isTestEnv = process.env.NODE_ENV === 'test'

let dataSourceConfig = {} as DataSourceOptions

if (isTestEnv) {
  dataSourceConfig = {
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    entities: [User],
    logging: true,
  }
} else {
  dataSourceConfig = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    entities: [User],
    logging: true,
  }
}

export const AppDataSource = new DataSource(dataSourceConfig)

