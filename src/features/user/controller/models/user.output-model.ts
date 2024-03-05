import {UserDocument} from "../../domain/user.entity";


export class UserOutputModel {
    id: string
    login: string
    email: string
    createdAt: string
}

export class UserServiceModel {
    id: string
    login: string
    email: string
    passwordSalt: string
    passwordHash: string
    createdAt: string
}

export class UserOutputModelWithPagination {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UserOutputModel[]
}

export const UserOutputMapper = (user: UserDocument): UserOutputModel => {
    const userOutputModel = new UserOutputModel()

    userOutputModel.id = user.id
    userOutputModel.login = user.login
    userOutputModel.email = user.email
    userOutputModel.createdAt = user.createdAt

    return userOutputModel
}

export const UserServiceMapper = (user: UserDocument): UserServiceModel => {
    const userServiceModel = new UserServiceModel()

    userServiceModel.id = user.id
    userServiceModel.login = user.login
    userServiceModel.email = user.email
    userServiceModel.passwordSalt = user.passwordSalt
    userServiceModel.passwordHash = user.passwordHash
    userServiceModel.createdAt = user.createdAt

    return userServiceModel
}