import {Injectable} from "@nestjs/common";
import {CreateUserDto} from "../controller/models/create-user.dto";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {User} from "../domain/user.entity";
import {UserRepository} from "../repositories/user.repository";
import {UserOutputMapper, UserServiceMapper} from "../controller/models/user.output-model";


@Injectable()
export class UserService {

    constructor(private userRepository: UserRepository) {}

    async createUser({login, password, email}: CreateUserDto) {
        const passwordSalt =  await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser = User.create(
            uuidv4(),
            login,
            email,
            passwordHash,
            passwordSalt,
            new Date().toISOString()
        )

        const user = await this.userRepository.createUser(newUser)

        if (!user) {
            return null
        }

        return UserOutputMapper(user)

    }

    async checkAuthCredentials (loginOrEmail: string) {
        const user =  await this.userRepository.findUserByLoginOrEmail(loginOrEmail)

        if (!user) {
            return null
        }

        return UserServiceMapper(user)

    }

    async deleteUserById (userId: string) {
        return await this.userRepository.deleteUser(userId)
    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }

}