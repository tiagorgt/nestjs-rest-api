import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { DatabaseModule } from '../database/database.module';
import { gameProviders } from './game.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [GameController],
  providers: [GameService, ...gameProviders],
})
export class GameModule {}
