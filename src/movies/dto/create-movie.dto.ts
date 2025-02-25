import { IsString, IsInt, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  year: number;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  isWinner: boolean;
}
