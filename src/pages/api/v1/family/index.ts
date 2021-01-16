import { NextApiRequest, NextApiResponse } from 'next';

type Response<T = any> = {
  status: 'OK' | 'ERROR';
  error?: string;
  data?: T;
};

export default async function family(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  if (!req.headers['x-family-api']) {
    return res.status(401).end();
  }

  if (req.headers['x-family-api'] !== process.env.FAMILY_API_SECRET) {
    return res.status(403).end();
  }

  res.json({ status: 'ERROR', error: 'NOT_IMPLEMENTED' });
}
