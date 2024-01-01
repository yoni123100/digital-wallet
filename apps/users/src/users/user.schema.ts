import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, unique: true, required: true })
  username: string;

  @Prop({ type: Number, required: true })
  amount: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
