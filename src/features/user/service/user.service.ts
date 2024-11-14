import {Injectable} from "@nestjs/common";
import {CreateUserDto} from "../controller/models/create-user.dto";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {User} from "../domain/user.entity";
import {UserRepository} from "../repositories/user.repository";
import {UserOutputMapper, UserServiceMapper} from "../controller/models/user.output-model";
import {add} from "date-fns";
import {MailManager} from "../../../common/manager/mail/mail-manager";

@Injectable()
export class UserService {

    constructor(
        private userRepository: UserRepository,
        private mailManager: MailManager
    ) {}

    async createUser({login, password, email}: CreateUserDto) {
        const passwordSalt =  await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser = User.create(
            uuidv4(),
            {
                login: login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date().toISOString(),
                imageUrl: ''
            },
            {
                confirmationCode: uuidv4(),
                    expirationDate: add(new Date, {minutes: 3}),
                    isConfirmed: false
            },
            {
            passwordRecoveryCode: uuidv4(),
                expirationDate: add(new Date, {minutes: 3}),
            }
        )


        const user = await this.userRepository.createUser(newUser)

        if (!user) {
            return null
        }

        await this.mailManager.sendConfirmationMail(newUser.accountData.login, newUser.accountData.email, newUser.emailConfirmation.confirmationCode)

        return UserOutputMapper(user)

    }

    async checkAuthCredentials (loginOrEmail: string) {
        const user =  await this.userRepository.findUserByLoginOrEmail(loginOrEmail)

        if (!user) {
            return null
        }

        return UserServiceMapper(user)

    }

    async changeUserData(id: string, newLogin: string, imageUrl: string | undefined) {
        const updatedUser = await this.userRepository.updateUserInfo(id, newLogin, imageUrl)

        if (!updatedUser) {
            return null
        }

        return UserOutputMapper(updatedUser)
    }

    async deleteUserById (userId: string) {
        return await this.userRepository.deleteUser(userId)
    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }

}