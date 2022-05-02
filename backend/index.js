import fastify from 'fastify';
import ffStatic from 'fastify-static';
import ffCookie from 'fastify-cookie';
import { resolve } from 'path';
import 'dotenv/config';

import JWT from './jwt.js';

import auth from './auth.js';
import api from './api.js';

const server = fastify({
  ignoreTrailingSlash: true,
  ajv: {
    customOptions: {
      coerceTypes: false,
    },
  },
});

server.decorate('jwt', new JWT(process.env.JWT_SECRET));

server.register(ffStatic, { root: resolve('frontend/public') });
server.register(ffCookie);

server.register(auth, { prefix: '/oauth' });
server.register(api, { prefix: '/api' });

server.get('/', (_req, rep) => {
  rep.sendFile('index.html');
});


server.listen(process.env.PORT, process.env.DOMAIN, err => {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  console.log('ready!');
});