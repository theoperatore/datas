import { setupServer } from 'msw/node';
import { rest as _rest } from 'msw';

export const rest = _rest;

export const server = setupServer(
  _rest.get('*', (req, res, ctx) => {
    return res(ctx.status(501));
  }),
);
