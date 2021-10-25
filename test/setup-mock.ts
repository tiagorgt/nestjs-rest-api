jest.mock('../src/database/database.providers', () => ({
  databaseProviders: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: () => ({ model: () => {} }),
    },
  ],
}));
