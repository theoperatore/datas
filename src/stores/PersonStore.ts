import Knex from 'knex';
import {
  IPersonStore,
  Person,
  Edge,
  Query,
  DirectedResult,
} from './IPersonStore';

export class PersonStore implements IPersonStore {
  private knex: Knex;

  constructor(knex: Knex) {
    // db instance
    // this.knex = Knex({
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
    // });
    this.knex = knex;
  }
  async searchByName(
    nameLike: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<Person[]> {
    const results = await this.knex
      .select('*')
      .from('persons')
      .where('name', 'like', `%${nameLike}%`)
      .limit(limit)
      .offset(offset);

    return results.map(p => ({
      ...p,
      id: `${p.id}`,
    }));
  }

  async removePersons(ids: string[]): Promise<string[]> {
    await this.knex.delete().from('persons').whereIn('id', ids);
    return ids;
  }

  async getPersons<T>(ids: string[], limit: number = 10) {
    const result: Person<T>[] = await this.knex
      .select('*')
      .from('persons')
      .whereIn('id', ids)
      .limit(limit);

    return new Map(result.map(p => [`${p.id}`, { ...p, id: `${p.id}` }]));
  }

  async putPersons<T>(persons: Omit<Person<T>, 'id'>[]) {
    return this.knex.transaction(async trx => {
      const out: Person<T>[] = [];
      for (const person of persons) {
        const [id] = await trx
          .insert({
            name: person.name,
            data: JSON.stringify(person.data || {}),
          })
          .into('persons');

        const [record] = await trx
          .select('*')
          .from('persons')
          .where('id', id)
          .limit(1);

        const data =
          typeof record.data === 'string' ? JSON.parse(record.data) : {};

        out.push({ ...record, id: `${record.id}`, data });
      }

      return out;
    });
  }

  async putEdges<E>(edges: Omit<Edge<E>, 'id'>[]) {
    return this.knex.transaction(async trx => {
      const out: Edge<E>[] = [];

      for (const edge of edges) {
        const [id] = await trx
          .insert({
            a_id: edge.a_id,
            b_id: edge.b_id,
            rel_type: edge.rel_type,
            data: JSON.stringify(edge.data || {}),
          })
          .into('edges');

        const [record] = await trx
          .select('*')
          .from('edges')
          .where('id', id)
          .limit(1);

        const data =
          typeof record.data === 'string' ? JSON.parse(record.data) : {};

        out.push({ ...record, id: `${record.id}`, data });
      }

      return out;
    });
  }

  async removeEdges(ids: string[]) {
    await this.knex.delete().from('edges').whereIn('id', ids);
    return ids;
  }

  async query<E>(q: Query[]) {
    return this.knex.transaction(async trx => {
      const results = [];
      for (const query of q) {
        const result = await trx
          .select('*')
          .from('edges')
          .where(b => b.where('a_id', query.id).orWhere('b_id', query.id))
          .andWhere(builder => {
            if (query.relType) {
              return builder.where('rel_type', query.relType);
            }
          })
          .limit(query.limit || 100);

        results.push([
          query.id,
          result.map(r => {
            const data = typeof r.data === 'string' ? JSON.parse(r.data) : {};
            return { ...r, id: `${r.id}`, data };
          }),
        ]);
      }

      return new Map<string, Edge<E>[]>(results);
    });
  }

  async queryDirected<E>(q: Query[]) {
    return this.knex.transaction(async trx => {
      const results = [];
      for (const query of q) {
        const [children, parents] = await Promise.all([
          trx
            .select('*')
            .from('edges')
            .where('a_id', query.id)
            .andWhere(b => {
              if (query.relType) {
                return b.where('rel_type', query.relType);
              }
            })
            .limit(query.limit || 100),
          trx
            .select('*')
            .from('edges')
            .where('b_id', query.id)
            .andWhere(b => {
              if (query.relType) {
                return b.where('rel_type', query.relType);
              }
            })
            .limit(query.limit || 100),
        ]);

        results.push([
          query.id,
          {
            parents: parents.map(r => {
              const data = typeof r.data === 'string' ? JSON.parse(r.data) : {};
              return { ...r, id: `${r.id}`, data };
            }),
            children: children.map(r => {
              const data = typeof r.data === 'string' ? JSON.parse(r.data) : {};
              return { ...r, id: `${r.id}`, data };
            }),
          },
        ]);
      }

      return new Map<string, DirectedResult<E>>(results);
    });
  }
}
