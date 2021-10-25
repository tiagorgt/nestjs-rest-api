import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GameModule } from '../src/game/game.module';
import { GameService } from '../src/game/game.service';
import { mockGames } from '../test/mock-games';

const mockGame = mockGames[0];
const { publisher: mockPublisher } = mockGame;

const buildMockFn = (successResponse) => {
  return jest
    .fn()
    .mockImplementationOnce(() => successResponse)
    .mockImplementationOnce(() => new Error('Async error'));
};

describe('GameController (e2e)', () => {
  let app: INestApplication;
  const gameService = {
    findAll: buildMockFn(mockGames),
    findOne: buildMockFn(mockGame),
    create: buildMockFn(mockGame),
    update: buildMockFn(mockGame),
    remove: buildMockFn(mockGame),
    findGamePublisher: buildMockFn(mockPublisher),
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [GameModule],
    })
      .overrideProvider(GameService)
      .useValue(gameService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /game', () => {
    const req = request(app.getHttpServer());
    req.get('/game').expect(200).expect(gameService.findAll());
    req.get('/game').expect(500).expect('Async error');
  });

  it('/GET /game/:id', () => {
    const req = request(app.getHttpServer());
    req.get('/game/:id').expect(200).expect(gameService.findOne());
    req.get('/game/:id').expect(500).expect('Async error');
  });

  it('/POST /game', () => {
    const req = request(app.getHttpServer());
    req.post('/game').expect(200).expect(gameService.create());
    req.post('/game').expect(500).expect('Async error');
  });

  it('/PUT /game/:id', () => {
    const req = request(app.getHttpServer());
    req.put('/game/:id').expect(200).expect(gameService.update());
    req.put('/game/:id').expect(500).expect('Async error');
  });

  it('/DELETE /game/:id', () => {
    const req = request(app.getHttpServer());
    req.delete('/game/:id').expect(200).expect(gameService.remove());
    req.delete('/game/:id').expect(500).expect('Async error');
  });

  it('/GET /game/:id/publisher', () => {
    const req = request(app.getHttpServer());
    req
      .get('/game/:id/publisher')
      .expect(200)
      .expect(gameService.findGamePublisher());
    req.get('/game/:id/publisher').expect(500).expect('Async error');
  });

  afterAll(async () => {
    await app?.close();
  });
});
