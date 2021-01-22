export type RelType = 'PARENT_OF' | 'SPOUSE';

export type Edge<E extends { [key: string]: any }> = {
  id: string;
  a_id: string;
  b_id: string;
  rel_type: RelType;
  data?: E;
};

export type Person<T extends { [key: string]: any } = any> = {
  id: string;
  name: string;
  data?: T;
};

export type Query = {
  id: string;
  limit?: number;
  relType?: RelType;
};

export interface IPersonStore {
  /**
   * Get many Persons from their Ids. Useful for getting the data associated with the Person.
   * @param ids the person ids of the records to get
   * @returns A map of id to Person. Not guaranteed to contain the record of the corresponding id.
   * Promise rejects only when reading the database fails.
   */
  getPersons<T>(ids: string[], limit?: number): Promise<Map<string, Person<T>>>;

  /**
   * Create or update many persons. Echos the created or updated persons.
   * @param persons An array of person to create or update in the database.
   * @returns Echos the persons created or updated. Rejects the promise if
   * writing fails. This action is atomic; if one write fails the rest are
   * reverted.
   */
  putPersons<T>(persons: Omit<Person<T>, 'id'>[]): Promise<Person<T>[]>;

  /**
   * Permanently delete persons. This is an atomic action.
   * @param ids The ids of the persons to delete.
   * @returns the ids of the persos deleted
   */
  removePersons(ids: string[]): Promise<string[]>;

  /**
   * Create or update an edge.
   * @param edges A single link between two Persons with some optional data
   * associated with the link.
   * @returns Echos the edges back. Rejects the promise if writing fails.
   * This action is atomic; if one write fails the rest are reverted.
   */
  putEdges<E>(edges: Omit<Edge<E>, 'id'>[]): Promise<Edge<E>[]>;

  /**
   * Remove the edges identified by id.
   * @param ids The Edge Ids to delete. This action is atomic; if one delete
   * fails then the rest are reverted.
   * @returns Echos the ids of the edges that were deleted.
   */
  removeEdges(ids: string[]): Promise<string[]>;

  /**
   * Query for Edges.
   * @param q Array of Query objects that specify a Person Id (can be either
   * person a or b in the edge) and optional rel type to query for.
   * Can also limit the number of relationships returned. Default
   * is to return all edges.
   * @returns A Map of person Id to Edge array. Rejects only if reading fails.
   * @example
   * const relationships = await query([{ id: '123' }])
   * const others: Person[] = relationships
   *   .get('123')
   *   .map(edge => edge.a.id === '123' ? edge.a : edge.b);
   *
   * // do something with those persons.
   */
  query<E>(q: Query[]): Promise<Map<string, Edge<E>[]>>;
}
