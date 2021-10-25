import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    @Inject('GAME_MODEL')
    private gameModel: Model<Game>,
  ) {}

  create(createGameDto: CreateGameDto) {
    return this.gameModel.create(createGameDto);
  }

  findAll() {
    return this.gameModel.find().exec();
  }

  findByReleaseDateBetween(startDate: Date, endDate: Date) {
    return this.gameModel
      .find({ releaseDate: { $gte: startDate, $lte: endDate } })
      .exec();
  }

  findByReleaseDateLowerThan(date: Date) {
    return this.gameModel.find({ releaseDate: { $lte: date } }).exec();
  }

  findOne(id: string) {
    return this.gameModel.findById(id).exec();
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    await this.validateId(id);
    return this.gameModel.findByIdAndUpdate(id, updateGameDto).exec();
  }

  async remove(id: string) {
    await this.validateId(id);
    return this.gameModel.findByIdAndRemove(id).exec();
  }

  async removeAll(ids: string[]) {
    await this.validateIds(ids);
    return this.gameModel.deleteMany({ id: [ids] });
  }

  async validateId(id: string) {
    if (!(await this.gameModel.exists({ _id: id })))
      throw Error(`Game with ${JSON.stringify({ id })} not found`);
  }

  async validateIds(ids: string[]) {
    if (!(await this.gameModel.exists({ _id: [ids] })))
      throw Error(
        `One or more games with ${JSON.stringify({ ids })} not found`,
      );
  }
}
