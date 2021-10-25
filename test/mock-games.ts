import { subMonths } from 'date-fns';

const currDate = new Date();
const customCurrDate = new Date(
  currDate.getFullYear(),
  currDate.getMonth(),
  currDate.getDate(),
);

export const mockGames = [
  {
    _id: '6172c9cac447cb22b831d7b7',
    title: 'Euro Truck Simulator 2',
    price: 1131,
    tags: ['simulation', 'truck'],
    releaseDate: subMonths(customCurrDate, 13),
    publisher: {
      name: 'SCS Software',
      siret: 1,
      phone: '47999658874',
      _id: '6172d3c4ca1b8829b205838e',
    },
    __v: 0,
  },
  {
    _id: '6176bb881f28e1f092421d4f',
    title: 'Counter-Strike: Global Offensive',
    price: 15,
    tags: ['fps', 'war'],
    releaseDate: subMonths(customCurrDate, 19),
    publisher: {
      name: 'Valve',
      siret: 2,
      phone: '47999658874',
      _id: '6176bb881f28e1f092421d50',
    },
    __v: 0,
  },
  {
    _id: '6176bbe11f28e1f092421d55',
    title: 'Cities: Skylines',
    price: 12,
    tags: ['simulation', 'city'],
    releaseDate: subMonths(customCurrDate, 19),
    publisher: {
      name: 'Paradox Interactive',
      siret: 3,
      phone: '47999658874',
      _id: '6176bbe11f28e1f092421d56',
    },
    __v: 0,
  },
  {
    _id: '6176bc3a1f28e1f092421d58',
    title: 'FIFA 22',
    price: 50,
    tags: ['football', 'sports'],
    releaseDate: customCurrDate,
    publisher: {
      name: 'Electronic Arts',
      siret: 4,
      phone: '47999658874',
      _id: '6176bc3a1f28e1f092421d59',
    },
    __v: 0,
  },
];
