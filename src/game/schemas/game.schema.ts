import * as mongoose from 'mongoose';
import { PublisherSchema } from './publisher.schema';

export const GameSchema = new mongoose.Schema({
  title: String,
  price: Number,
  tags: [String],
  releaseDate: Date,
  publisher: PublisherSchema,
});
