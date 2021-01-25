import { DataSource } from 'apollo-datasource';
import Knex from 'knex';
import DataLoader from 'dataloader';
import {
  RelationshipInput,
  RelationshipKind,
} from '../schema/schema.generated';
import { PersonStore } from './PersonStore';
import { Person, DirectedResult } from './IPersonStore';

function createPersonLoader(store: PersonStore) {
  return new DataLoader<string, Person>(async ids => {
    const resultsMap = await store.getPersons(ids);
    return ids.map(i => resultsMap.get(i));
  });
}

function createQueryLoader<E>(store: PersonStore) {
  return new DataLoader<string, DirectedResult<E>>(async ids => {
    const resultsMap = await store.queryDirected<E>(
      ids.map(id => ({ id, limit: 100 })),
    );

    return ids.map(id => resultsMap.get(id));
  });
}

export class PersonStoreDataSource extends DataSource {
  private store: PersonStore;
  private personLoader: DataLoader<string, Person>;
  private queryLoader: DataLoader<string, DirectedResult<any>>;

  constructor(knex: Knex) {
    super();

    this.store = new PersonStore(knex);
    this.personLoader = createPersonLoader(this.store);
    this.queryLoader = createQueryLoader(this.store);
  }

  async getEdgesForPerson(id: string) {
    return this.queryLoader.load(id);
  }

  async getPerson(id: string) {
    return this.personLoader.load(id);
  }

  async createPerson(name: string) {
    const [result] = await this.store.putPersons([{ name }]);
    return result;
  }

  async linkPersons(a_id: string, b_id: string, type: RelationshipKind) {
    return this.store.putEdges([{ a_id, b_id, rel_type: type }]);
  }

  async createRelationships(a_id: string, rels: RelationshipInput[]) {
    if (rels.length === 0) return [];
    const edges = rels.map(e => ({ a_id, b_id: e.otherId, rel_type: e.kind }));
    return await this.store.putEdges(edges);
  }

  async search(name: string, limit?: number, offset?: number) {
    return this.store.searchByName(name, limit, offset);
  }
}
