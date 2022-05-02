import Oauth from './oauth.js';

export default function (server, _opts, done) {
  server.get('/', async (request, reply) => {
    if (!request.query.code) return reply.redirect(`https://discord.com/oauth2/authorize?response_type=code&client_id=${process.env.DSC_ID}&scope=identify&redirect_uri=${process.env.DSC_REDIRECT}` + (request.query.redirect ? `&state=${encodeURIComponent(request.query.redirect)}` : ''));

    const tokens = await Oauth.token({
      client_id: process.env.DSC_ID,
      client_secret: process.env.DSC_SECRET,
      code: request.query.code,
      redirect_uri: process.env.DSC_REDIRECT,
    });
    
    const user = await Oauth.user(tokens);

    const jwt = server.jwt.sign({ id: user.id });

    reply.setCookie('token', jwt, { sameSite: 'lax' });
    reply.redirect('/' + (/^[-\w\d?=&#\/%]+$/.test(request.query.state || '') ? request.query.state : ''));
  });

  
  done();
}