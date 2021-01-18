import { DataSource } from 'apollo-datasource';
import Knex from 'knex';
import { PersonStore } from './PersonStore';

export class PersonStoreDataSource extends DataSource {
  private store: PersonStore;
  constructor(knex: Knex) {
    super();

    this.store = new PersonStore(
      knex,
      // Knex({
      //   // mysql2 can handle the auth sequence required from
      //   // mysql v8...mysql cannot do that.
      //   client: 'mysql2',
      //   connection: {
      //     host: process.env.DB_HOST,
      //     user: process.env.DB_USERNAME,
      //     password: process.env.DB_PASSWORD,
      //     port: Number(process.env.DB_PORT),
      //     database: process.env.DB_DATABASE,
      //     ssl: {
      //       ca: process.env.DB_CERT,
      //       rejectUnauthorized: false,
      //     },
      //   },
      //   debug: process.env.NODE_ENV !== 'production',
      // }),
    );
  }

  async getPersons(ids: string[]) {
    const result = await this.store.getPersons(ids, ids.length);
    return ids.map(id => result.get(id)).filter(i => i);
  }
}
