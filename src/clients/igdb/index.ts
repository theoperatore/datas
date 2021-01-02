import fetch from 'isomorphic-unfetch';

export type TwitchGame = {
  id: number;
  cover?: {
    id: number;
    url: string;
  };
  first_release_date?: number;
  name: string;
  platforms?: { id: string; name: string }[];
  screenshots?: { id: number; url: string }[];
  summary?: string;
  url: string;
};

type Token = {
  access_token: string;
  expires_in: number;
  token_type: 'bearer';
};

const BASE = 'https://api.igdb.com/v4';

async function getToken(client: string, secret: string) {
  const url = `https://id.twitch.tv/oauth2/token?client_id=${client}&client_secret=${secret}&grant_type=client_credentials`;
  const response: Token = await (await fetch(url, { method: 'POST' })).json();
  return response.access_token;
}

function constructAuthHeaders(token: string, client: string) {
  return {
    'Client-ID': client,
    Authorization: `Bearer ${token}`,
  };
}

async function getTotalGames(headers: any) {
  const r = await fetch(`${BASE}/games/count`, { method: 'POST', headers });
  return r.json();
}

function getRandomOffset(max: number) {
  return Math.floor(Math.random() * (max - 1));
}

export async function getRandomGame(client: string, secret: string) {
  const token = await getToken(client, secret);
  const headers = constructAuthHeaders(token, client);

  const { count } = await getTotalGames(headers);
  const offset = getRandomOffset(count);

  const body = `fields name,first_release_date,platforms.name,summary,url,cover.url,screenshots.url;limit 1;offset ${offset};`;
  const result = await fetch(`${BASE}/games`, {
    method: 'POST',
    headers,
    body,
  });

  const [game] = (await result.json()) as TwitchGame[];
  return game;
}
