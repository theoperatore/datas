import { AuthenticationError } from 'apollo-server-micro';
import { NextApiRequest } from 'next';

export function checkFamilyAuth(
  secret: string,
  { req }: { req: NextApiRequest },
) {
  const familyHeader = req.headers['x-family-api'];
  if (!familyHeader) {
    throw new AuthenticationError('Invalid auth header');
  }

  if (familyHeader !== secret) {
    throw new AuthenticationError('Invalid auth header');
  }
}
