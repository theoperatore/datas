import { formatDateFromGame, selectImage } from './utils';

test('selectImage returns first image starting with the largest', () => {
  expect(
    selectImage({
      super_url: 'super',
      screen_url: 'screen',
      medium_url: 'medium',
      small_url: 'small',
      thumb_url: 'thumb',
      icon_url: 'icon',
      tiny_url: 'tiny',
    }),
  ).toBe('super');
  expect(
    selectImage({
      super_url: '',
      screen_url: 'screen',
      medium_url: 'medium',
      small_url: 'small',
      thumb_url: 'thumb',
      icon_url: 'icon',
      tiny_url: 'tiny',
    }),
  ).toBe('screen');
  expect(
    selectImage({
      super_url: '',
      screen_url: '',
      medium_url: 'medium',
      small_url: 'small',
      thumb_url: 'thumb',
      icon_url: 'icon',
      tiny_url: 'tiny',
    }),
  ).toBe('medium');
  expect(
    selectImage({
      super_url: '',
      screen_url: '',
      medium_url: '',
      small_url: 'small',
      thumb_url: 'thumb',
      icon_url: 'icon',
      tiny_url: 'tiny',
    }),
  ).toBe('small');
  expect(
    selectImage({
      super_url: '',
      screen_url: '',
      medium_url: '',
      small_url: '',
      thumb_url: 'thumb',
      icon_url: 'icon',
      tiny_url: 'tiny',
    }),
  ).toBe('thumb');
  expect(
    selectImage({
      super_url: '',
      screen_url: '',
      medium_url: '',
      small_url: '',
      thumb_url: '',
      icon_url: 'icon',
      tiny_url: 'tiny',
    }),
  ).toBe('icon');
  expect(
    selectImage({
      super_url: '',
      screen_url: '',
      medium_url: '',
      small_url: '',
      thumb_url: '',
      icon_url: '',
      tiny_url: 'tiny',
    }),
  ).toBe('tiny');
  expect(
    selectImage({
      super_url: '',
      screen_url: '',
      medium_url: '',
      small_url: '',
      thumb_url: '',
      icon_url: '',
      tiny_url: '',
    }),
  ).toBe('');
});

test('formatDateFromGame returns default string when no dates', () => {
  expect(formatDateFromGame({})).toBe('No date listed');
});

test('formatDateFromGame returns default string when no year given', () => {
  expect(formatDateFromGame({ expected_release_day: '30' })).toBe(
    'No date listed',
  );
});

test('formatDateFromGame returns date from original_release_date', () => {
  expect(
    formatDateFromGame({ original_release_date: '2020-12-19' }),
  ).toMatchInlineSnapshot(`"Dec 19, 2020"`);
});

test('formatDateFromGame returns partial date from just month', () => {
  expect(
    formatDateFromGame({ original_release_date: '2020-12-19' }),
  ).toMatchInlineSnapshot(`"Dec 19, 2020"`);
});

test('formatDateFromGame returns partial date from year', () => {
  expect(
    formatDateFromGame({ expected_release_year: '2020' }),
  ).toMatchInlineSnapshot(`"2020"`);
});

test('formatDateFromGame returns partial date from year and quarter', () => {
  expect(
    formatDateFromGame({
      expected_release_year: '2020',
      expected_release_quarter: 'Q3',
    }),
  ).toMatchInlineSnapshot(`"Q3 2020"`);
});

test('formatDateFromGame returns partial date from year and month (1-indexed)', () => {
  expect(
    formatDateFromGame({
      expected_release_year: '2020',
      expected_release_month: '3',
    }),
  ).toMatchInlineSnapshot(`"Mar 2020"`);
});

test('formatDateFromGame returns date from year, month, and day', () => {
  expect(
    formatDateFromGame({
      expected_release_year: '2020',
      expected_release_month: '3',
      expected_release_day: '10',
    }),
  ).toMatchInlineSnapshot(`"Mar 10, 2020"`);
});
