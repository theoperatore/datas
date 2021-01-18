import { NextApiRequest, NextApiResponse } from 'next';
import { withFamilyAuth } from '../../../../middlewares';

async function family(req: NextApiRequest, res: NextApiResponse) {
  res.status(405).end();
}

export default withFamilyAuth(process.env.FAMILY_API_SECRET, family);
