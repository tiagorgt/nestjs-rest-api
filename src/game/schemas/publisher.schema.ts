import * as mongoose from 'mongoose';

export const PublisherSchema = new mongoose.Schema({
  name: String,
  siret: Number,
  phone: String,
});
