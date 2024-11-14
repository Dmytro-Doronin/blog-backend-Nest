import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    @Prop({type: String ,required: true})
    id: string

    @Prop({
        type: {
            login: {type: String, required: true},
            email: {type: String, required: true},
            passwordHash: {type: String, required: true},
            passwordSalt: {type: String, required: true},
            createdAt: {type: String, required: true},
            imageUrl: {type: String, required: false}
        },
        required: true,
        default: {}
    })
    accountData: {
        login: string,
        email: string,
        passwordHash: string,
        passwordSalt: string,
        createdAt: string,
        imageUrl?: string
    }
    @Prop({
        type: {
            confirmationCode: {type: String, required: true} ,
            expirationDate: {type: Date,  required: true},
            isConfirmed: {type: Boolean, required: true}
        },
        required: true,
        default: {}
    })
    emailConfirmation: {
        confirmationCode: string ,
        expirationDate: Date,
        isConfirmed: boolean
    }
    @Prop({
        type: {
            passwordRecoveryCode: {type: String, required: true},
            expirationDate: {type: Date,  required: true},
        },
        required: true,
        default: {}
    })
    passwordRecovery: {
        passwordRecoveryCode: string,
        expirationDate: Date,
    }

    // @Prop({required: true})
    // login: string
    //
    // @Prop({required: true})
    // email: string
    //
    // @Prop({required: true})
    // passwordHash: string
    //
    // @Prop({required: true})
    // passwordSalt: string
    //
    // @Prop({required: true})
    // createdAt: string


    static create(
        id: string,
        accountData : {
            login: string,
            email: string,
            passwordHash: string,
            passwordSalt: string,
            createdAt: string
            imageUrl: string
        },
        emailConfirmation: {
            confirmationCode: string,
            expirationDate: Date,
            isConfirmed: boolean
        },
        passwordRecovery: {
            passwordRecoveryCode: string,
            expirationDate: Date
        }
        ) {
        const user = new User()

        // user.id = id
        // user.accountData.login = accountData.login
        // user.accountData.email = accountData.email
        // user.accountData.passwordHash = accountData.passwordHash
        // user.accountData.passwordSalt = accountData.passwordSalt
        // user.accountData.createdAt = accountData.createdAt
        // user.emailConfirmation.confirmationCode = emailConfirmation.confirmationCode
        // user.emailConfirmation.expirationDate = emailConfirmation.expirationDate
        // user.emailConfirmation.isConfirmed = emailConfirmation.isConfirmed
        // user.passwordRecovery.passwordRecoveryCode = passwordRecovery.passwordRecoveryCode
        // user.passwordRecovery.expirationDate = passwordRecovery.expirationDate

        user.id = id;
        user.accountData = { ...accountData };
        user.emailConfirmation = { ...emailConfirmation };
        user.passwordRecovery = { ...passwordRecovery };

        return user
    }
}

export const UserSchema = SchemaFactory.createForClass(User)