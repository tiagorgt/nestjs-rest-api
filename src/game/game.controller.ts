import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subMonths } from 'date-fns';

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('/game/:id')
  getGameById(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  @Post('/game')
  createGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Put('/game/:id')
  updateGame(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(id, updateGameDto);
  }

  @Get('/game')
  getGames() {
    return this.gameService.findAll();
  }

  @Delete('/game/:id')
  removeGame(@Param('id') id: string) {
    return this.gameService.remove(id);
  }

  @Get('/game/:id/publisher')
  async getGamePublisher(@Param('id') id: string) {
    const game = await this.gameService.findOne(id);
    const { publisher = {} } = game || {};
    return publisher;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async applyDiscount() {
    try {
      console.log('[GameController][applyDiscount]: apply discount started');

      const currentDate = new Date();

      const discountStartDate = subMonths(currentDate, 18);
      const discountEndDate = subMonths(currentDate, 12);

      const gamesToApplyDiscount =
        await this.gameService.findByReleaseDateBetween(
          discountStartDate,
          discountEndDate,
        );

      console.log(
        `[GameController][applyDiscount]: games found: ${JSON.stringify(
          gamesToApplyDiscount,
        )}`,
      );

      gamesToApplyDiscount.forEach((game) =>
        this.gameService.update(game._id, {
          ...game,
          price: game.price - game.price * 0.2,
        }),
      );

      console.log('[GameController][applyDiscount]: apply discount finished');
    } catch (err) {
      console.error(
        `[GameController][applyDiscount]: error: ${JSON.stringify(err)}`,
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearOldGames() {
    try {
      console.log('[GameController][clearOldGames]: clear old games started');

      const currentDate = new Date();
      const removeDate = subMonths(currentDate, 18);
      const gamesToRemove = await this.gameService.findByReleaseDateLowerThan(
        removeDate,
      );

      console.log(
        `[GameController][clearOldGames]: games found: ${JSON.stringify(
          gamesToRemove,
        )}`,
      );

      if (gamesToRemove.length)
        this.gameService.removeAll(gamesToRemove.map(({ _id }) => _id));

      console.log('[GameController][clearOldGames]: clear old games finished');
    } catch (err) {
      console.error(
        `[GameController][clearOldGames]: error: ${JSON.stringify(err)}`,
      );
    }
  }
}
