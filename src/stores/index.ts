import { DataSource } from 'apollo-datasource';
import Knex from 'knex';
import { RelationshipInput } from '../schema/schema.generated';
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
  async getEdgesForPerson(id: string) {
    return this.store.queryDirected([{ id, limit: 100 }]);
  }

  async getPersons(ids: string[]) {
    const persons = await this.store.getPersons(ids, ids.length);

    return ids.map(id => persons.get(id)).filter(i => i);
  }

  async createPerson(name: string) {
    const [result] = await this.store.putPersons([{ name }]);
    return result;
  }

  async createRelationships(a_id: string, rels: RelationshipInput[]) {
    if (rels.length === 0) return [];
    const edges = rels.map(e => ({ a_id, b_id: e.otherId, rel_type: e.type }));
    return await this.store.putEdges(edges);
  }

  async search(name: string, limit?: number, offset?: number) {
    return this.store.searchByName(name, limit, offset);
  }
}
