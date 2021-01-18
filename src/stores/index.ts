import Knex from 'knex';
import { PersonStore } from './PersonStore';

export function createPersonStore() {
  return new PersonStore(
    Knex({
      // mysql2 can handle the auth sequence required from
      // mysql v8...mysql cannot do that.
      client: 'mysql2',
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_DATABASE,
        ssl: {
          ca: process.env.DB_CERT,
          rejectUnauthorized: false,
        },
      },
      debug: process.env.NODE_ENV !== 'production',
    }),
  );
}
