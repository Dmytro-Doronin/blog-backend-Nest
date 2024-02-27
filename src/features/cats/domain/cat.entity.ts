import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop()
    age: number;

    @Prop()
    breed: string;

    static create(name: string, age: number, breed: string) {
        const user = new User();

        user.name = name;
        user.age = age;
        user.breed = breed
        return user;
    }
}

export const UserSchema = SchemaFactory.createForClass(User);