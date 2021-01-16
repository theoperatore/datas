import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export function withFamilyAuth(secret: string, handler: NextApiHandler) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    const familyHeader = req.headers['x-family-api'];
    if (!familyHeader) {
      return res.status(401).end();
    }

    if (familyHeader !== secret) {
      return res.status(403).end();
    }

    return handler(req, res);
  };
}
