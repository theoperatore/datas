import fetch from 'isomorphic-unfetch';
export { formatDateFromGame, selectImage } from './utils';

export type GameImage = {
  original_url?: string;
  super_url?: string;
  screen_url?: string;
  screen_large_url?: string;
  medium_url?: string;
  small_url?: string;
  thumb_url?: string;
  icon_url?: string;
  tiny_url?: string;
};

export type Game = {
  id: number;
  guid: string;
  image?: GameImage;
  name: string;
  deck?: string | null;
  description?: string | null;
  original_release_date?: string;
  site_detail_url?: string;
  expected_release_day?: string | null;
  expected_release_month?: string | null;
  expected_release_year?: string | null;
  expected_release_quarter?: string | null;
  platforms?: {
    api_detail_url: string;
    id: number;
    name: string;
    site_detail_url: string;
    abbreviation: string;
  }[];
  concepts?: {
    api_detail_url: string;
    id: number;
    name: string;
    site_detail_url: string;
  }[];
  developers?: {
    api_detail_url: string;
    id: number;
    name: string;
    site_detail_url: string;
  }[];
  characters?: {
    api_detail_url: string;
    id: number;
    name: string;
    site_detail_url: string;
  }[];
  themes?: {
    api_detail_url: string;
    id: number;
    name: string;
    site_detail_url: string;
  }[];
};

export type GiantBombResponse = {
  error: 'OK' | 'ERROR'; // I can't remember what exactly these values can be, but just someting that isn't OK will be enough
  version: string;
  limit: number;
  offset: number;
  number_of_page_results: number;
  number_of_total_results: number;
  status_code: number;
  results: { api_detail_url: string }[];
};

export type GiantBombGameResponse = {
  error: 'OK' | 'ERROR'; // I can't remember what exactly these values can be, but just someting that isn't OK will be enough
  version: string;
  limit: number;
  offset: number;
  number_of_page_results: number;
  number_of_total_results: number;
  status_code: number;
  results: Game;
};

async function getMaxGamesNumber(token: string) {
  const response = await fetch(
    `https://www.giantbomb.com/api/games/?api_key=${token}&limit=1&field_list=id&format=json`,
  );
  const parsed = (await response.json()) as GiantBombResponse;

  if (parsed.error != 'OK') {
    throw new Error(
      `Failed request to GiantBomb for max games number. error status (${parsed.error})`,
    );
  }

  return parsed.number_of_total_results;
}

async function getGame(token: string, max: number) {
  // get a random number between 0 and (max - 1) because max
  // is the number of all games (like a length of an array)
  // and offset is a 0-based index. so we really want a
  // random number between the first index (0) and the last index (length -1).
  const random = Math.floor(Math.random() * (max - 1));
  const response = await fetch(
    `https://www.giantbomb.com/api/games/?api_key=${token}&limit=1&format=json&offset=${random}&field_list=api_detail_url`,
  );
  const parsed = (await response.json()) as GiantBombResponse;

  if (parsed.error != 'OK') {
    throw new Error(
      `Failed request to GiantBomb for game. error status (${parsed.error}), offset: (${random}), max: (${max})`,
    );
  }

  if (parsed.results.length === 0) {
    throw new Error(
      `GiantBomb query produced 0 games. offset: (${random}), max: (${max})`,
    );
  }

  const { api_detail_url } = parsed.results[0];
  if (!api_detail_url) {
    throw new Error(
      `GiantBomb query with no api_detail_url. offset: (${random}), max: (${max})`,
    );
  }

  const fields = [
    'name',
    'site_detail_url',
    'themes',
    'platforms',
    'original_release_date',
    'image',
    'id',
    'guid',
    'expected_release_year',
    'expected_release_quarter',
    'expected_release_month',
    'expected_release_day',
    'developers',
    'deck',
    'description',
    'concepts',
    'characters',
  ].join(',');
  const gameResponse = await fetch(
    `${api_detail_url}?api_key=${token}&format=json&field_list=${fields}`,
  );
  const gameResponseJson = (await gameResponse.json()) as GiantBombGameResponse;

  if (gameResponseJson.error != 'OK') {
    throw new Error(
      `Failed request to GiantBomb for game. error status (${parsed.error}), offset: (${random}), max: (${max})`,
    );
  }

  return gameResponseJson.results;
}

export async function getRandomGotd(token: string) {
  if (!token)
    throw new Error(`No GiantBomb Api Token found. (GB_TOKEN required).`);

  const maxGames = await getMaxGamesNumber(token);
  return await getGame(token, maxGames);
}
