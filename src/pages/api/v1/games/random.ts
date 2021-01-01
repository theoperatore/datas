import { NextApiRequest, NextApiResponse } from 'next';
import { Game, getRandomGotd } from '../../../../clients/gotd';

type Data = {
  status: 'OK' | 'ERROR';
  result: Game | string; // error message
};

export default async function random(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const game = await getRandomGotd(process.env.GB_TOKEN);
    res.json({ status: 'OK', result: game });
  } catch (error) {
    res.json({ status: 'ERROR', result: 'Failed to get game.' });
  }
}
