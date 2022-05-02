const t = {
  String: { type: 'string' },
  Number: { type: 'number' },
  Integer: { type: 'integer' },
  Boolean: { type: 'boolean' },
  Array: (type, min = 1) => ({ type: 'array', items: type, minItems: min }),
  Object: (props, required, more = false) => ({ type: 'object', properties: props, required, additionalProperties: more }), 
};

const allOf = (...schemas) => ({ allOf: schemas });
const anyOf = (...schemas) => ({ anyOf: schemas });
const oneOf = (...schemas) => ({ oneOf: schemas });

const field = {
  name: t.String,
  description: t.String,
  type: t.String,
  required: t.Boolean,
  options: oneOf(t.Array(t.String), t.Object({ max: t.Integer })),
};

const stage = {
  name: t.String,
  fields: t.Array(t.Object(field, ['name', 'type'])),
};

const perms = { perms: t.Integer, users: t.Array(t.String, 0) };
const access = {
  view: t.Object(perms, ['users']),
  edit: t.Object(perms, ['users']),
};

const form = {
  name: t.String,
  description: t.String,
  access: t.Object(access, ['view', 'edit']),
  stages: t.Array(t.Object(stage, ['name', 'fields'])),
};


const answer = {
  ...field,
  value: oneOf(t.Array(t.String), t.String, t.Boolean),
};

const response = t.Array(t.Object(answer, ['name', 'type', 'value']));



export const forms = {
  post: {
    body: t.Object(form, ['name', 'access', 'stages']),
  },

  patch: {
    body: t.Object(form, ['name', 'access', 'stages']),
  },
};

export const responses = {
  post: {
    body: response,
  },
};