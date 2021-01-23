import Knex from 'knex';
import {
  IPersonStore,
  Person,
  Edge,
  Query,
  DirectedResult,
  RelType,
} from './IPersonStore';

export class PersonStore implements IPersonStore {
  private knex: Knex;

  constructor(knex: Knex) {
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

  async getPersons<T>(ids: readonly string[], limit: number = 10) {
    const result: Person<T>[] = await this.knex
      .select('*')
      .from('persons')
      .whereIn('id', ids)
      .limit(limit);

    return new Map(result.map(p => [`${p.id}`, { ...p, id: `${p.id}` }]));
  }

  async putPersons<T>(persons: { id?: string; name: string; data?: T }[]) {
    return this.knex.transaction(async trx => {
      const out: Person<T>[] = [];
      for (const person of persons) {
        let id: number | string;
        if (person.id) {
          await trx('persons')
            .update({
              name: person.name,
              data: JSON.stringify(person.data || {}),
            })
            .where('id', person.id);

          id = person.id;
        } else {
          const result = await trx
            .insert({
              name: person.name,
              data: JSON.stringify(person.data || {}),
            })
            .into('persons');

          id = result[0];
        }

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

  async putEdges<E>(
    edges: {
      a_id: string;
      b_id: string;
      rel_type: RelType;
      data?: E;
      id?: string;
    }[],
  ) {
    return this.knex.transaction(async trx => {
      const out: Edge<E>[] = [];

      for (const edge of edges) {
        let id: number | string;
        if (edge.id) {
          // TODO: should this have conditional fields so
          // we only update the fields that are given rather
          // that require all of it or nothing?
          await trx
            .update({
              rel_type: edge.rel_type,
              data: JSON.stringify(edge.data || {}),
            })
            .where('id', edge.id)
            .into('edges');

          id = edge.id;
        } else {
          const [result] = await trx
            .insert({
              a_id: edge.a_id,
              b_id: edge.b_id,
              rel_type: edge.rel_type,
              data: JSON.stringify(edge.data || {}),
            })
            .into('edges');

          id = result;
        }

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
    const results = await this.query<E>(q);
    const grouped: [string, DirectedResult<E>][] = q.map(query => {
      const result = results.get(query.id);
      return [
        query.id,
        {
          // a => b, so if I find my id in b, then a is my parent.
          parents: result.filter(r => r.b_id === query.id),
          // a => b, so if I find my id in a, then b is my child.
          children: result.filter(r => r.a_id === query.id),
        },
      ];
    });
    return new Map<string, DirectedResult<E>>(grouped);
  }
}
