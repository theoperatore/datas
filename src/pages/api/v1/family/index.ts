import { NextApiRequest, NextApiResponse } from 'next';
import { withFamilyAuth } from '../../../../middlewares';

type Response<T = any> = {
  status: 'OK' | 'ERROR';
  error?: string;
  data?: T;
};

async function family(req: NextApiRequest, res: NextApiResponse<Response>) {
  res.json({ status: 'ERROR', error: 'NOT_IMPLEMENTED' });
}

export default withFamilyAuth(process.env.FAMILY_API_SECRET, family);
