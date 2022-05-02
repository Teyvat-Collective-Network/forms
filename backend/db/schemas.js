import mongoose from 'mongoose';
const { Schema } = mongoose;

const field = {
  name: String,
  description: String,
  type: { type: String },
  required: Boolean,
  options: Schema.Types.Mixed,
}

const stage = {
  name: String,
  fields: [field],
}

const access = {
  view: { perms: Number, users: [] },
  edit: { perms: Number, users: [] },
}

export const form = new Schema({
  name: String,
  description: String,
  author: String,
  access,
  stages: [stage],
});


const answer = {
  ...field,
  value: Schema.Types.Mixed,
}

export const response = new Schema({
  form: Schema.Types.ObjectId,
  submitter: String,
  answers: [answer],
});