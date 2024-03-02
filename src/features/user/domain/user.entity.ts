import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    @Prop({required: true})
    id: string

    @Prop({required: true})
    login: string

    @Prop({required: true})
    email: string

    @Prop({required: true})
    passwordHash: string

    @Prop({required: true})
    passwordSalt: string

    @Prop({required: true})
    createdAt: string

    static create(
        id: string,
        login: string,
        email: string,
        passwordHash: string,
        passwordSalt: string,
        createdAt: string
    ) {
        const user = new User()
        user.id = id
        user.login = login
        user.email = email
        user.passwordHash = passwordHash
        user.passwordSalt = passwordSalt
        user.createdAt = createdAt
        return user
    }
}

export const UserSchema = SchemaFactory.createForClass(User)