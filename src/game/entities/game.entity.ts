import { Document } from 'mongoose';
import { Publisher } from './publisher.entity';

export class Game extends Document {
  title: string;
  price: number;
  publisher: Publisher;
  tags: string[];
  releaseDate: Date;
}
