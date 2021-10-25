import { CreatePublisherDto } from './create-publisher-dto';

export class CreateGameDto {
  title: string;
  price: number;
  publisher: CreatePublisherDto;
  tags: string[];
  releaseDate: Date;
}
