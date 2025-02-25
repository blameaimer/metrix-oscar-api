import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  year: number;

  @Prop()
  director: string;

  @Prop()
  isWinner: boolean;

  _id?: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
