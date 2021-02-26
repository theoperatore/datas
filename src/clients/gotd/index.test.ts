import { server, rest } from '../../../test/server';
import { Game, getRandomGotd } from './index';

const original = Math.random;
const mockRandom = jest.fn().mockImplementation(() => 0.25);

beforeAll(() => {
  Math.random = mockRandom;
});

afterAll(() => {
  Math.random = original;
});

const MOCK_GAME: Game = {
  deck: 'Test Game Deck',
  description: 'Test Game Description',
  id: 123,
  image: {
    super_url: 'some-image-url',
  },
  name: 'Test Game',
  platforms: [
    {
      abbreviation: 'Alorg',
      api_detail_url: '',
      id: 34,
      name: 'Al Organization',
      site_detail_url: '',
    },
  ],
  site_detail_url: '',
  expected_release_day: '',
  expected_release_month: '',
  expected_release_quarter: '',
  expected_release_year: '',
  original_release_date: '',
  characters: [],
  concepts: [],
  developers: [],
  guid: '123',
  themes: [],
};

test('It fails if no token is provided', () => {
  return expect(getRandomGotd('')).rejects.toThrowErrorMatchingInlineSnapshot(
    `"No GiantBomb Api Token found. (GB_TOKEN required)."`,
  );
});

test('It fails if max games is not successfull', () => {
  server.use(
    rest.get('https://www.giantbomb.com/api/games/', (req, res, ctx) => {
      return res.once(ctx.json({ error: 'TEST_ERROR' }));
    }),
  );

  return expect(
    getRandomGotd('test-token'),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Failed request to GiantBomb for max games number. error status (TEST_ERROR)"`,
  );
});

test('It fails if get game with offset is not successfull', () => {
  server.use(
    rest.get('https://www.giantbomb.com/api/games/', (req, res, ctx) => {
      return res.once(ctx.json({ error: 'OK', number_of_total_results: 100 }));
    }),
    rest.get('https://www.giantbomb.com/api/games/', (req, res, ctx) => {
      return res.once(ctx.json({ error: 'TEST_ERROR' }));
    }),
  );

  return expect(
    getRandomGotd('test-token'),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Failed request to GiantBomb for game. error status (TEST_ERROR), offset: (24), max: (100)"`,
  );
});

test('It fails if get game with offset returns no results', () => {
  server.use(
    rest.get('https://www.giantbomb.com/api/games/', (req, res, ctx) => {
      return res.once(ctx.json({ error: 'OK', number_of_total_results: 100 }));
    }),
    rest.get('https://www.giantbomb.com/api/games/', (req, res, ctx) => {
      return res.once(ctx.json({ error: 'OK', results: [] }));
    }),
  );

  return expect(
    getRandomGotd('test-token'),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"GiantBomb query produced 0 games. offset: (24), max: (100)"`,
  );
});

test('It returns a game', () => {
  server.use(
    rest.get('https://www.giantbomb.com/api/games/', (req, res, ctx) => {
      return res.once(ctx.json({ error: 'OK', number_of_total_results: 100 }));
    }),
    rest.get('https://www.giantbomb.com/api/games/', (req, res, ctx) => {
      return res.once(
        ctx.json({
          error: 'OK',
          results: [
            { api_detail_url: 'https://www.giantbomb.com/api/game/abc/' },
          ],
        }),
      );
    }),
    rest.get('https://www.giantbomb.com/api/game/abc/', (req, res, ctx) => {
      return res.once(ctx.json({ error: 'OK', results: MOCK_GAME }));
    }),
  );

  return expect(getRandomGotd('test-token')).resolves.toMatchObject(MOCK_GAME);
});
