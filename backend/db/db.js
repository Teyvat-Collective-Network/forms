import mongoose from 'mongoose';

import * as schemas from './schemas.js';

const Form = mongoose.model('Form', schemas.form);
const Response = mongoose.model('Response', schemas.response);

await mongoose.connect(process.env.MONGO);

export { mongoose, Form, Response };