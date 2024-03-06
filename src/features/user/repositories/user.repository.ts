import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {User} from "../domain/user.entity";
import {Model} from "mongoose";
import {UserServiceMapper} from "../controller/models/user.output-model";

@Injectable()
export class UserRepository {

    constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

    async createUser(newUser: User){
        try {
            await this.UserModel.create(newUser)
            const findUser = await this.UserModel.findOne({id: newUser.id})

            if (!findUser) {
                return null
            }

            return findUser
        } catch (e) {
            console.log(e)
            throw new Error('User was not created')
        }
    }

    async deleteUser(userId: string) {
        try {
            const res = await this.UserModel.deleteOne({id: userId})

            return res.deletedCount === 1

        } catch (e) {
            throw new Error('User was not deleted')
        }
    }

    async findUserByLoginOrEmail (loginOrEmail: string) {
        try {
            return await this.UserModel.findOne({$or: [{'accountData.email':loginOrEmail },{'accountData.login': loginOrEmail}]})

        } catch (e) {
            throw new Error('User was not found')
        }

    }

    async updateConfirmation (id: string) {

        try {
            const result = await this.UserModel.updateOne({id}, {$set: {"emailConfirmation.isConfirmed": true}})
            return result.modifiedCount === 1
        } catch (e) {
            throw new Error('Confirmation was not changed')
        }

    }

    async updateConfirmationCode (id: string, code: string, date: Date) {
        try {
            const result = await this.UserModel.updateOne(
                {id},
                {$set: {
                        "emailConfirmation.confirmationCode": code,
                        "emailConfirmation.expirationDate": date
                    }})

            return result.modifiedCount === 1
        } catch (e) {
            throw new Error('Confirmation was not changed')
        }
    }

    async getUserByConfirmationCode (code: string)  {

        try {
            const user = await this.UserModel.findOne({"emailConfirmation.confirmationCode": code}).lean()
            if (!user) {
                return null
            }
            return user
        } catch (e) {
            throw new Error('User was not found')
        }
    }

    async getUserByPasswordRecoveryCode (code: string)  {

        try {
            const user = await this.UserModel.findOne({"emailConfirmation.confirmationCode": code}).lean()
            if (!user) {
                return null
            }
            return user
        } catch (e) {
            throw new Error('User was not found')
        }
    }

    async updatePassword (passwordSalt: string, passwordHash: string, userId: string) {

        try {

            const result = await this.UserModel.updateOne(
                {id: userId},
                {$set: {
                        "accountData.passwordHash": passwordHash,
                        "accountData.passwordSalt": passwordSalt
                    }})

            return result.modifiedCount === 1
        } catch (e) {
            throw new Error('Confirmation was not changed')
        }
    }

    async updatePasswordRecoveryCode(userId: string, code: string, date: Date) {
        try {
            const result = await this.UserModel.updateOne(
                {id: userId},
                {$set: {
                        "passwordRecovery.passwordRecoveryCode": code,
                        "passwordRecovery.expirationDate": date
                    }})

            return result.modifiedCount === 1
        } catch (e) {
            throw new Error('Confirmation was not changed')
        }
    }

}