import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { UserRole } from '@fixora/types';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User {
  @Prop({ required: true, index: true })
  tenantId!: string;

  @Prop({ required: true, lowercase: true, trim: true, index: true })
  email!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({
    required: true,
    type: String,
    enum: ['owner', 'dispatcher', 'technician'],
  })
  role!: UserRole;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ type: String, default: null })
  refreshTokenHash?: string | null;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ tenantId: 1, email: 1 }, { unique: true });
