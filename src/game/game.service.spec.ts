import { Test, TestingModule } from '@nestjs/testing';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;

  const mockExists = jest
    .fn()
    .mockResolvedValueOnce(true)
    .mockResolvedValueOnce(true)
    .mockResolvedValueOnce(true)
    .mockResolvedValueOnce(false)
    .mockResolvedValueOnce(false)
    .mockResolvedValueOnce(false);

  const mockGameModelProvider = {
    create: jest.fn(),
    find: jest.fn().mockImplementation(() => ({ exec: jest.fn() })),
    findById: jest.fn().mockImplementation(() => ({ exec: jest.fn() })),
    findByIdAndUpdate: jest
      .fn()
      .mockImplementation(() => ({ exec: jest.fn() })),
    findByIdAndRemove: jest
      .fn()
      .mockImplementation(() => ({ exec: jest.fn() })),
    deleteMany: jest.fn(),
    exists: mockExists,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'GAME_MODEL', useValue: mockGameModelProvider },
        GameService,
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should call create function with expected param', () => {
    const createSpy = jest.spyOn(service, 'create');
    const dto = new CreateGameDto();
    service.create(dto);
    expect(createSpy).toHaveBeenCalledWith(dto);
    expect(mockGameModelProvider.create).toHaveBeenCalled();
  });

  it('should call findAll function', () => {
    const findAllSpy = jest.spyOn(service, 'findAll');
    service.findAll();
    expect(findAllSpy).toHaveBeenCalled();
    expect(mockGameModelProvider.find).toHaveBeenCalled();
  });

  it('should call findByReleaseDateBetween function with expected param', () => {
    const findByReleaseDateBetweenSpy = jest.spyOn(
      service,
      'findByReleaseDateBetween',
    );
    const startDate = new Date();
    const endDate = new Date();
    service.findByReleaseDateBetween(startDate, endDate);
    expect(findByReleaseDateBetweenSpy).toHaveBeenCalledWith(
      startDate,
      endDate,
    );
    expect(mockGameModelProvider.find).toHaveBeenCalled();
  });

  it('should call findByReleaseDateLowerThan function with expected param', () => {
    const findByReleaseDateLowerThanSpy = jest.spyOn(
      service,
      'findByReleaseDateLowerThan',
    );
    const date = new Date();
    service.findByReleaseDateLowerThan(date);
    expect(findByReleaseDateLowerThanSpy).toHaveBeenCalledWith(date);
    expect(mockGameModelProvider.find).toHaveBeenCalled();
  });

  it('should call findOne function with expected param', () => {
    const findOneSpy = jest.spyOn(service, 'findOne');
    const id = 'id';
    service.findOne(id);
    expect(findOneSpy).toHaveBeenCalledWith(id);
    expect(mockGameModelProvider.findById).toHaveBeenCalled();
  });

  it('should call remove function with expected param', async () => {
    const removeSpy = jest.spyOn(service, 'remove');
    const id = 'id';
    await service.remove(id);
    expect(removeSpy).toHaveBeenCalledWith(id);
    expect(mockGameModelProvider.findByIdAndRemove).toHaveBeenCalled();
  });

  it('should call removeAll function with expected param', async () => {
    const removeAllSpy = jest.spyOn(service, 'removeAll');
    const ids = ['id1', 'id2'];
    await service.removeAll(ids);
    expect(removeAllSpy).toHaveBeenCalledWith(ids);
    expect(mockGameModelProvider.deleteMany).toHaveBeenCalled();
  });

  it('should call update function with expected param', async () => {
    const updateSpy = jest.spyOn(service, 'update');
    const id = 'id';
    const dto = new UpdateGameDto();
    await service.update(id, dto);
    expect(updateSpy).toHaveBeenCalledWith(id, dto);
    expect(mockGameModelProvider.findByIdAndUpdate).toHaveBeenCalled();
  });

  it('should throw error for game not found on update', async () => {
    const id = 'id';
    try {
      await service.update(id, new UpdateGameDto());
    } catch (err) {
      expect(err.message).toMatch(
        `Game with ${JSON.stringify({ id })} not found`,
      );
    }
  });

  it('should throw error for game not found on remove', async () => {
    const id = 'id';
    try {
      await service.remove(id);
    } catch (err) {
      expect(err.message).toMatch(
        `Game with ${JSON.stringify({ id })} not found`,
      );
    }
  });

  it('should throw error for game not found on removeAll', async () => {
    const ids = ['id1', 'id2'];
    try {
      await service.removeAll(ids);
    } catch (err) {
      expect(err.message).toMatch(
        `One or more games with ${JSON.stringify({ ids })} not found`,
      );
    }
  });
});
