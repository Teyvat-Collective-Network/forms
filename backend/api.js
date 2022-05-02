import { Client } from '@aroleaf/tcn-api';
import * as db from './db/db.js';
import * as schemas from './schemas.js';

export default function (server, _opts, done) {
  const tcn = new Client({ socketUrl: process.env.API_SOCKET, restUrl: process.env.API_REST });

  server.decorateRequest('auth', async function () {
    const user = server.jwt.verify(this.headers.authorization);
    if (!user) return;
    const res = tcn.users.get(user.id);
    if (res) user.perms = res.roles;
    return user;
  });


  server.get('/forms', async (req, rep) => {
    const user = await req.auth() || { perms: 0 };
    const forms = await db.Form.find({ active: true });
    
    return rep.send({
      forms: forms
        .filter(form => hasAccess(user, form.access.view))
        .map(form => ({
          _id: form._id,
          name: form.name,
          description: form.description,
          canEdit: hasAccess(user, form.access.edit),
        })),
      canCreate: !!user.perms,
    });
  });


  server.post('/forms', { schema: schemas.forms.post }, async (req, rep) => {
    const user = await req.auth();
    if (!user) return rep.code(401).send(new Error('You are not logged in'));
    if (!user.perms) return rep.code(403).send(new Error('You are not allowed to create forms'));

    if (await db.Form.exists({ name: req.body.name })) return rep.code(409).send(new Error('A form with that name already exists'));
    if (!validate(req.body)) return rep.code(400).send(new Error('Invalid form data'));

    const form = await db.Form.create({
      ...req.body,
      author: user.id,
    });

    return rep.code(200).send(form);
  });


  server.get('/forms/:id', async (req, rep) => {
    const user = await req.auth();
    if (!user) return rep.code(401).send(new Error('You are not logged in'));
    const form = await db.Form.findById(req.params.id).catch(discardCastError);

    if (!form) rep.code(404).send(new Error('That form does not exists'));
    if (!hasAccess(user, form.access.edit)) return rep.code(403).send(new Error('You are not allowed to view this form'));

    return rep.send({
      ...form.toObject(),
      canEdit: hasAccess(user, form.access.edit),
    });
  });


  server.patch('/forms/:id', { schema: schemas.forms.patch }, async (req, rep) => {
    const user = await req.auth();
    if (!user) return rep.code(401).send(new Error('You are not logged in'));
    const form = await db.Form.findById(req.params.id).catch(discardCastError);

    if (!form) rep.code(404).send(new Error('That form does not exists'));
    if (!hasAccess(user, form.access.edit)) return rep.code(403).send(new Error('You are not allowed to edit this form'));
    if (!validate(req.body)) rep.code(400).send(new Error('Invalid form data'));

    await form.updateOne(req.body);

    return rep.code(204).send();
  });


  server.delete('/forms/:id', async (req, rep) => {
    const user = await req.auth();
    if (!user) return rep.code(401).send(new Error('You are not logged in'));
    const form = await db.Form.findById(req.params.id).catch(discardCastError);

    if (!form) rep.code(404).send(new Error('That form does not exists'));
    if (!hasAccess(user, form.access.edit)) return rep.code(403).send(new Error('You are not allowed to delete this form'));

    await form.deleteOne()

    return rep.code(204).send();
  });


  server.get('/forms/:id/responses', async (req, rep) => {
    const user = await req.auth();
    if (!user) return rep.code(401).send(new Error('You are not logged in'));
    const form = await db.Form.findById(req.params.id).catch(discardCastError);
    
    if (!form) rep.code(404).send(new Error('That form does not exists'));
    if (!hasAccess(user, form.access.edit)) return rep.code(403).send(new Error('You are not allowed to view responses to this form'));

    return rep.send(await db.Response.find({ form: req.params.id }));
  });


  server.post('/forms/:id/responses', { schema: schemas.responses.post }, async (req, rep) => {
    const user = await req.auth();
    if (!user) return rep.code(401).send(new Error('You are not logged in'));
    const form = await db.Form.findById(req.params.id).catch(discardCastError);

    if (!form) return rep.code(404).send(new Error('That form does not exist'));
    if (!hasAccess(user, form.access.view)) return rep.code(403).send(new Error('You are not allowed to respond to this form'));

    await db.Response.create({
      form: req.params.id,
      submitter: user.id,
      answers: req.body,
    })

    return rep.code(204).send();
  });


  server.delete('/forms/:form/responses/:id', async (req, rep) => {
    const user = await req.auth();
    if (!user) return rep.code(401).send(new Error('You are not logged in'));
    const response = await db.Response.findById(req.params.id).catch(discardCastError);
    const form = response && await db.Form.findById(response.form).catch(discardCastError);

    if (!response || response.form !== req.params.form) return rep.code(404).send(new Error('That response does not exist on that form'));
    if (!hasAccess(user, form.access.edit)) return rep.code(403).send(new Error('You are not allowed to delete this response'));

    await response.deleteOne(req.params.id);

    return rep.code(204).send();
  });


  done();
}


function hasAccess(user, required) {
  return !!(
    (user.perms & 3<<9) ||
    required.everyone ||
    (required.perms & user.perms) ||
    required.users.includes(user.id)
  );
}


function discardCastError(err) {
  if (err instanceof db.mongoose.CastError) return;
  throw err;
}


function validate(form) {
  if (!form.name || !form.stages.length) return false;
  return form.stages.every(stage =>
    stage.name &&
    stage.fields.length &&
    stage.fields.every(field =>
      field.name &&
      (['text', 'none', 'checkbox'].includes(field.type) || field.options?.length && field.options.every(o=>o))
  ));
}