import { NextApiRequest, NextApiResponse } from 'next';
import { Game, getRandomGotd } from '../../../../clients/gotd';
import { TwitchGame, getRandomGame } from '../../../../clients/igdb';

type Data = {
  status: 'OK' | 'ERROR';
  result: TwitchGame | Game | string; // error message
};

export default async function random(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { client } = req.query;

  if (client === 'igdb') {
    try {
      const game = await getRandomGame(
        process.env.TWITCH_CLIENT,
        process.env.TWITCH_SECRET,
      );
      res.json({ status: 'OK', result: game });
    } catch (error) {
      res.json({ status: 'ERROR', result: 'Failed to get igdb game.' });
    }
    return;
  }

  try {
    const game = await getRandomGotd(process.env.GB_TOKEN);
    res.json({ status: 'OK', result: game });
  } catch (error) {
    res.json({ status: 'ERROR', result: 'Failed to get giantbomb game.' });
  }
}
