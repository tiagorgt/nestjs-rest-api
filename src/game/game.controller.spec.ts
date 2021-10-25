import { Test, TestingModule } from '@nestjs/testing';
import { isAfter, isBefore, subMonths } from 'date-fns';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { mockGames } from '../../test/mock-games';

describe('GameController', () => {
  let controller: GameController;

  const mockFindByReleaseDateLowerThan = jest
    .fn()
    .mockImplementation(async () => {
      const currentDate = new Date();
      const removeDate = subMonths(currentDate, 18);
      return mockGames.filter((game) =>
        isBefore(new Date(game.releaseDate), removeDate),
      );
    });

  const findByReleaseDateBetween = jest.fn().mockImplementation(async () => {
    const currentDate = new Date();

    const discountStartDate = subMonths(currentDate, 18);
    const discountEndDate = subMonths(currentDate, 12);

    return mockGames.filter((game) => {
      const releaseDate = new Date(game.releaseDate);

      return (
        isAfter(releaseDate, discountStartDate) &&
        isBefore(releaseDate, discountEndDate)
      );
    });
  });

  const mockGameService = {
    create: jest.fn(),
    findAll: jest.fn().mockReturnValue(mockGames),
    findByReleaseDateBetween: findByReleaseDateBetween,
    findByReleaseDateLowerThan: mockFindByReleaseDateLowerThan,
    findOne: jest.fn().mockReturnValue(mockGames[1]),
    update: jest.fn(),
    remove: jest.fn(),
    removeAll: jest.fn(),
  };

  beforeAll(() => {
    const currDate = new Date();
    jest.useFakeTimers();
    jest.setSystemTime(
      new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate()),
    );
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [{ provide: GameService, useValue: mockGameService }],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  it('should call createGame function', () => {
    const dto = new CreateGameDto();
    controller.createGame(dto);
    console.log({ mockGames });
    expect(mockGameService.create).toHaveBeenCalledWith(dto);
  });

  it('should call getGames function', () => {
    controller.getGames();
    expect(mockGameService.create).toHaveBeenCalled();
  });

  it('should call applyDiscount function', async () => {
    const currentDate = new Date();
    const discountStartDate = subMonths(currentDate, 18);
    const discountEndDate = subMonths(currentDate, 12);
    console.log({ currentDate, discountEndDate, discountStartDate });

    await controller.applyDiscount();
    expect(mockGameService.findByReleaseDateBetween).toHaveBeenCalledWith(
      discountStartDate,
      discountEndDate,
    );

    const game = mockGames[0]; //euro truck
    const { _id, price } = game || {};

    expect(mockGameService.update).toHaveBeenCalledWith(_id, {
      ...game,
      price: price - price * 0.2,
    });
  });

  it('should call clearOldGames function', async () => {
    const currentDate = new Date();
    const removeDate = subMonths(currentDate, 18);

    await controller.clearOldGames();
    expect(mockGameService.findByReleaseDateLowerThan).toHaveBeenCalledWith(
      removeDate,
    );
    expect(mockGameService.removeAll).toHaveBeenCalledWith([
      '6176bb881f28e1f092421d4f', //csgo
      '6176bbe11f28e1f092421d55', //cities skylines
    ]);
  });

  it('should call getGameById function', () => {
    const id = 'id';
    controller.getGameById(id);
    expect(mockGameService.findOne).toHaveBeenCalledWith(id);
  });

  it('should call getGamePublisher function', async () => {
    const id = 'id';
    const res = await controller.getGamePublisher(id);
    expect(mockGameService.findOne).toHaveBeenCalledWith(id);
    expect(res).toBe(mockGames[1].publisher);
  });

  it('should call removeGame function', () => {
    const id = 'id';
    controller.removeGame(id);
    expect(mockGameService.remove).toHaveBeenCalledWith(id);
  });

  it('should call updateGame function', () => {
    const id = 'id';
    const dto = new UpdateGameDto();
    controller.updateGame(id, dto);
    expect(mockGameService.update).toHaveBeenCalledWith(id, dto);
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
