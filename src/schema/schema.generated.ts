import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  search: SearchResult;
  persons: Array<Person>;
};

export type QuerySearchArgs = {
  name: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type QueryPersonsArgs = {
  ids?: Maybe<Array<Scalars['ID']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPerson: Person;
  linkPersons?: Maybe<Scalars['Boolean']>;
};

export type MutationCreatePersonArgs = {
  name: Scalars['String'];
  relationships?: Maybe<Array<RelationshipInput>>;
};

export type MutationLinkPersonsArgs = {
  from: Scalars['ID'];
  to: Scalars['ID'];
  type: RelationshipType;
};

export type RelationshipInput = {
  otherId: Scalars['ID'];
  type: RelationshipType;
};

export type SearchResult = {
  __typename?: 'SearchResult';
  persons: Array<Person>;
};

export type Person = {
  __typename?: 'Person';
  id: Scalars['ID'];
  name: Scalars['String'];
  personToMe: Array<Relationship>;
  meToPerson: Array<Relationship>;
};

export type Relationship = {
  __typename?: 'Relationship';
  id: Scalars['ID'];
  person: Person;
  type: RelationshipType;
};

export enum RelationshipType {
  ParentOf = 'PARENT_OF',
  Spouse = 'SPOUSE',
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  RelationshipInput: RelationshipInput;
  SearchResult: ResolverTypeWrapper<SearchResult>;
  Person: ResolverTypeWrapper<Person>;
  Relationship: ResolverTypeWrapper<Relationship>;
  RelationshipType: RelationshipType;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  String: Scalars['String'];
  Int: Scalars['Int'];
  ID: Scalars['ID'];
  Mutation: {};
  Boolean: Scalars['Boolean'];
  RelationshipInput: RelationshipInput;
  SearchResult: SearchResult;
  Person: Person;
  Relationship: Relationship;
}>;

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  search?: Resolver<
    ResolversTypes['SearchResult'],
    ParentType,
    ContextType,
    RequireFields<QuerySearchArgs, 'name' | 'limit' | 'offset'>
  >;
  persons?: Resolver<
    Array<ResolversTypes['Person']>,
    ParentType,
    ContextType,
    RequireFields<QueryPersonsArgs, 'ids'>
  >;
}>;

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
  createPerson?: Resolver<
    ResolversTypes['Person'],
    ParentType,
    ContextType,
    RequireFields<MutationCreatePersonArgs, 'name' | 'relationships'>
  >;
  linkPersons?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    RequireFields<MutationLinkPersonsArgs, 'from' | 'to' | 'type'>
  >;
}>;

export type SearchResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']
> = ResolversObject<{
  persons?: Resolver<Array<ResolversTypes['Person']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Person'] = ResolversParentTypes['Person']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  personToMe?: Resolver<
    Array<ResolversTypes['Relationship']>,
    ParentType,
    ContextType
  >;
  meToPerson?: Resolver<
    Array<ResolversTypes['Relationship']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RelationshipResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Relationship'] = ResolversParentTypes['Relationship']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  person?: Resolver<ResolversTypes['Person'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['RelationshipType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  SearchResult?: SearchResultResolvers<ContextType>;
  Person?: PersonResolvers<ContextType>;
  Relationship?: RelationshipResolvers<ContextType>;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
