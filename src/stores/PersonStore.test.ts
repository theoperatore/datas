import fs from 'fs';
import Knex from 'knex';
import { PersonStore } from './PersonStore';

let knex: Knex;
beforeAll(async () => {
  knex = Knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './test-db.sqlite3',
    },
  });

  await knex.schema.createTable('persons', t => {
    t.increments('id').primary().unsigned().notNullable();
    t.string('name').notNullable();
    t.json('data');
  });

  await knex.schema.createTable('edges', t => {
    t.increments('id').primary().notNullable();
    t.string('a_id').notNullable();
    t.string('b_id').notNullable();
    t.string('rel_type').notNullable();
    t.json('data');
  });
});

afterAll(() => {
  fs.unlinkSync('./test-db.sqlite3');
});

test('It can create a person', async () => {
  const store = new PersonStore(knex);
  const al = {
    name: 'Al',
  };
  const result = await store.putPersons([al]);
  expect(result[0]).toMatchObject(al);
});

test('It can create many persons', async () => {
  const store = new PersonStore(knex);
  const al1 = {
    name: 'Al1',
  };
  const al2 = {
    name: 'Al2',
  };
  const result = await store.putPersons([al1, al2]);
  expect(result[0]).toMatchObject(al1);
  expect(result[1]).toMatchObject(al2);
});

test('It can get a person', async () => {
  const store = new PersonStore(knex);
  const [p] = await store.putPersons([{ name: 'Test 1' }]);
  const expectedMap = await store.getPersons([p.id]);
  expect(expectedMap.get(p.id)).toMatchObject(p);
});

test('It can delete a person', async () => {
  const store = new PersonStore(knex);
  const [p] = await store.putPersons([{ name: 'Test 1' }]);
  const [id] = await store.removePersons([p.id]);
  expect(p.id).toBe(id);
});

test('It can create an edge between two persons', async () => {
  const store = new PersonStore(knex);
  const [p1, p2] = await store.putPersons([
    { name: 'Test 1' },
    { name: 'Test 2' },
  ]);
  const expected: any = { a_id: p1.id, b_id: p2.id, rel_type: 'PARENT_OF' };

  const [result] = await store.putEdges([expected]);
  expect(result).toMatchObject(expected);
});

test('It can remove edges between two persons', async () => {
  const store = new PersonStore(knex);
  const [p1, p2] = await store.putPersons([
    { name: 'Test 1' },
    { name: 'Test 2' },
  ]);
  const [edge] = await store.putEdges([
    { a_id: p1.id, b_id: p2.id, rel_type: 'PARENT_OF' },
  ]);
  const [removedId] = await store.removeEdges([edge.id]);
  expect(removedId).toEqual(edge.id);
  const results = await store.query([{ id: p1.id }]);
  expect(results.get(p1.id).length).toBe(0);
});

test('It can query for a relationships', async () => {
  const store = new PersonStore(knex);
  const [p1, p2] = await store.putPersons([
    { name: 'Test 1' },
    { name: 'Test 2' },
  ]);
  const [edge] = await store.putEdges([
    { a_id: p1.id, b_id: p2.id, rel_type: 'PARENT_OF' },
  ]);

  const resultsMap = await store.query([{ id: p1.id, relType: 'PARENT_OF' }]);
  const [result] = resultsMap.get(p1.id);
  expect(result).toMatchObject(edge);
});

test('It can query for directed relationships', async () => {
  const store = new PersonStore(knex);
  const [p1, p2] = await store.putPersons([
    { name: 'Test 1' },
    { name: 'Test 2' },
  ]);
  const [edge] = await store.putEdges([
    { a_id: p1.id, b_id: p2.id, rel_type: 'PARENT_OF' },
  ]);

  const resultsMap = await store.queryDirected([{ id: p1.id }]);
  const result = resultsMap.get(p1.id).children[0];
  expect(result).toMatchObject(edge);
  expect(resultsMap.get(p1.id).parents).toHaveLength(0);

  const p2ResultsMap = await store.queryDirected([{ id: p2.id }]);
  const p2Results = p2ResultsMap.get(p2.id);
  expect(p2Results.children).toHaveLength(0);
  expect(p2Results.parents[0]).toMatchObject(edge);
  expect(p2Results.parents).toHaveLength(1);
});

test('It can store json data on a person', async () => {
  const store = new PersonStore(knex);
  const p = {
    name: 'al',
    data: {
      arbitrary: {
        data: {
          of: {
            varying: {
              length: 'neat',
            },
          },
        },
      },
    },
  };

  const [person] = await store.putPersons([p]);
  expect(person).toMatchObject(p);
});

test('It can store json data on an edge', async () => {
  const store = new PersonStore(knex);
  const [p1, p2] = await store.putPersons([
    { name: 'Test 1' },
    { name: 'Test 2' },
  ]);
  const edge: any = {
    a_id: p1.id,
    b_id: p2.id,
    rel_type: 'PARENT',
    data: { some: { arbitrary: { data: 'cool ' } } },
  };
  const [result] = await store.putEdges([edge]);
  const resultMap = await store.query([{ id: p1.id }]);
  const [queryEdge] = resultMap.get(p1.id);

  expect(result).toMatchObject(edge);
  expect(queryEdge).toMatchObject(edge);
});
