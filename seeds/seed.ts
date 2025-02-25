import { connect } from 'mongoose';
import { MovieSchema } from '../src/movies/schemas/movie.schema';

async function seed() {
  const connection = await connect('mongodb://localhost:27017/oscar_db');
  const MovieModel = connection.model('Movie', MovieSchema);

  await MovieModel.deleteMany({});
  await MovieModel.insertMany([
    {
      title: 'The Godfather',
      year: 1972,
      director: 'Francis Ford Coppola',
      description: 'Crime drama',
      isWinner: true,
    },
    {
      title: 'La La Land',
      year: 2016,
      director: 'Damien Chazelle',
      description: 'Musical romance',
      isWinner: false,
    },
  ]);

  console.log('Database seeded!');
  process.exit();
}

seed();
