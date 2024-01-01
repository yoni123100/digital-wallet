import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/user.schema';

export type GroupDocument = HydratedDocument<Group>;

@Schema()
export class Group {
  @Prop({ type: [{ type: Types.ObjectId, ref: () => User }] })
  users: User[];

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true, default: 0 })
  amount: number;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
