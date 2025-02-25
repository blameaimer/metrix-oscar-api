/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { MoviesService } from './movies/movies.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './movies/schemas/movie.schema';

describe('Movies Module (e2e)', () => {
  let app: INestApplication;
  let moviesService: MoviesService;
  let movieModel: Model<Movie>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    moviesService = moduleFixture.get<MoviesService>(MoviesService);
    movieModel = moduleFixture.get<Model<Movie>>(getModelToken(Movie.name));

    await movieModel.deleteMany({});

    await Promise.all([
      moviesService.create({
        title: 'The Godfather',
        description: 'A crime dynasty transfers control to the son.',
        year: 1972,
        director: 'Francis Ford Coppola',
        isWinner: true,
      }),
      moviesService.create({
        title: 'Pulp Fiction',
        description: 'Lives of hitmen intertwine in a crime drama.',
        year: 1994,
        director: 'Quentin Tarantino',
        isWinner: false,
      }),
      moviesService.create({
        title: 'Inception',
        description: 'A mind-bending thriller.',
        year: 2010,
        director: 'Christopher Nolan',
        isWinner: true,
      }),
    ]);
  });

  afterAll(async () => {
    await movieModel.deleteMany();
    await app.close();
  });

  it('GET /movies should return paginated results', async () => {
    const response = await request(app.getHttpServer()).get(
      '/movies?page=1&limit=2',
    );
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.total).toBe(3);
  });

  it('GET /movies with search query should return filtered results', async () => {
    const response = await request(app.getHttpServer()).get(
      '/movies?search=Godfather',
    );
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe('The Godfather');
  });

  it('GET /movies sorted by release year in descending order', async () => {
    const response = await request(app.getHttpServer()).get(
      '/movies?sortBy=year&order=desc',
    );
    expect(response.status).toBe(200);
    expect(response.body.data[0].title).toBe('Inception');
  });

  it('GET /movies sorted by title in ascending order', async () => {
    const response = await request(app.getHttpServer()).get(
      '/movies?sortBy=title&order=asc',
    );
    expect(response.status).toBe(200);
    expect(response.body.data[0].title).toBe('Inception');
  });

  it('GET /movies/winners should return only winning movies', async () => {
    const response = await request(app.getHttpServer()).get('/movies/winners');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    const titles = response.body.map((movie: Movie) => movie.title);
    expect(titles).toContain('The Godfather');
    expect(titles).toContain('Inception');
  });

  it('POST /movies should create a new movie', async () => {
    const newMovie: Movie = {
      title: 'The Dark Knight',
      description: 'Batman faces the Joker in Gotham City.',
      year: 2008,
      director: 'Christopher Nolan',
      isWinner: true,
    };

    const response = await request(app.getHttpServer())
      .post('/movies')
      .send(newMovie);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('The Dark Knight');
  });

  it('PATCH /movies/:id should update a movie', async () => {
    const movies = await moviesService.findAll({
      page: 1,
      limit: 10,
      search: '',
      sortBy: 'title',
      order: 'asc',
    });
    const movieId = movies.data.find(
      (movie) => movie.title === 'The Dark Knight',
    )?._id;

    if (!movieId) throw new Error('Movie not found for update');

    const response = await request(app.getHttpServer())
      .patch(`/movies/${movieId}`)
      .send({ title: 'The Dark Knight Rises' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('The Dark Knight Rises');
  });

  it('DELETE /movies/:id should delete a movie', async () => {
    const newMovie = await moviesService.create({
      title: 'The Dark Knight',
      description: 'Batman faces the Joker.',
      year: 2008,
      director: 'Christopher Nolan',
      isWinner: true,
    });

    const response = await request(app.getHttpServer()).delete(
      `/movies/${newMovie._id}`,
    );
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('The Dark Knight');

    const deletedMovie = newMovie._id
      ? await moviesService.findOne(newMovie._id).catch(() => null)
      : null;
    expect(deletedMovie).toBeNull();
  });

  it('GET /movies/:id should return 404 if movie not found', async () => {
    const invalidId = '65d7c274b792d51111111111';
    const response = await request(app.getHttpServer()).get(
      `/movies/${invalidId}`,
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`Movie with ID ${invalidId} not found`);
  });

  it('PATCH /movies/:id should return 404 if movie not found', async () => {
    const invalidId = '65d7c274b792d51111111111';
    const response = await request(app.getHttpServer())
      .patch(`/movies/${invalidId}`)
      .send({ title: 'Nonexistent Movie' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`Movie with ID ${invalidId} not found`);
  });

  it('DELETE /movies/:id should return 404 if movie not found', async () => {
    const invalidId = '65d7c274b792d51111111111';
    const response = await request(app.getHttpServer()).delete(
      `/movies/${invalidId}`,
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`Movie with ID ${invalidId} not found`);
  });

  it('findOne() should return a movie if found', async () => {
    const mockMovie = {
      _id: '65d7c274b792d51111111111',
      title: 'Inception',
      description: 'A mind-bending thriller.',
      year: 2010,
      director: 'Christopher Nolan',
      isWinner: true,
    };

    jest.spyOn(movieModel, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockMovie),
    } as any);

    const result = await moviesService.findOne(mockMovie._id);
    expect(result).toEqual(mockMovie);
    expect(movieModel.findById).toHaveBeenCalledWith(mockMovie._id);
  });

  it('findOne() should throw NotFoundException if movie not found', async () => {
    const invalidId = '65d7c274b792d51199999999';

    jest.spyOn(movieModel, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(null),
    } as any);

    await expect(() => moviesService.findOne(invalidId)).rejects.toThrow(
      new NotFoundException(`Movie with ID ${invalidId} not found`),
    );

    expect(movieModel.findById).toHaveBeenCalledWith(invalidId);
  });
});
