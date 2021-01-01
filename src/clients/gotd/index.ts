import fetch from 'isomorphic-unfetch';
export { formatDateFromGame, selectImage } from './utils';

export type GameImage = {
  super_url?: string;
  screen_url?: string;
  medium_url?: string;
  small_url?: string;
  thumb_url?: string;
  icon_url?: string;
  tiny_url?: string;
};

export type Game = {
  id: number;
  image: GameImage;
  name: string;
  deck: string;
  description: string;
  original_release_date?: string;
  site_detail_url: string;
  expected_release_day?: string;
  expected_release_month?: string;
  expected_release_year?: string;
  expected_release_quarter?: string;
  platforms: {
    api_detail_url: string;
    id: number;
    name: string;
    site_detail_url: string;
    abbreviation: string;
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
  results: Game[];
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
    `https://www.giantbomb.com/api/games/?api_key=${token}&limit=1&&format=json&offset=${random}`,
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

  return parsed.results[0];
}

export async function getRandomGotd(token: string) {
  if (!token)
    throw new Error(`No GiantBomb Api Token found. (GB_TOKEN required).`);

  const maxGames = await getMaxGamesNumber(token);
  return await getGame(token, maxGames);
}
