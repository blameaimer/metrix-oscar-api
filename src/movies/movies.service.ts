import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    return await this.movieModel.create(createMovieDto);
  }

  async findAll(options: {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    order: 'asc' | 'desc';
  }): Promise<{ data: Movie[]; total: number }> {
    const { page, limit, search, sortBy, order } = options;
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    const sortOrder: SortOrder = order === 'asc' ? 1 : -1;
    const sortCriteria: Record<string, SortOrder> = { [sortBy]: sortOrder };

    const [data, total] = await Promise.all([
      this.movieModel
        .find(query)
        .sort(sortCriteria)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.movieModel.countDocuments(query).exec(),
    ]);

    return { data, total };
  }

  async findWinners(): Promise<Movie[]> {
    return await this.movieModel.find({ isWinner: true }).exec();
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieModel.findById(id).exec();
    if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const updatedMovie = await this.movieModel
      .findByIdAndUpdate(id, updateMovieDto, { new: true })
      .exec();
    if (!updatedMovie)
      throw new NotFoundException(`Movie with ID ${id} not found`);
    return updatedMovie;
  }

  async remove(id: string): Promise<Movie> {
    const deletedMovie = await this.movieModel.findByIdAndDelete(id).exec();
    if (!deletedMovie)
      throw new NotFoundException(`Movie with ID ${id} not found`);
    return deletedMovie;
  }
}
