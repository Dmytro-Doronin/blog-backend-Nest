import {UserDocument} from "../../domain/user.entity";


export class UserOutputModel {
    id: string
    login: string
    email: string
    createdAt: string
    imageUrl: string | undefined
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
    userOutputModel.login = user.accountData.login
    userOutputModel.email = user.accountData.email
    userOutputModel.createdAt = user.accountData.createdAt
    userOutputModel.imageUrl = user.accountData.imageUrl

    return userOutputModel

}

export const UserServiceMapper = (user: UserDocument): UserServiceModel => {
    const userServiceModel = new UserServiceModel()

    userServiceModel.id = user.id
    userServiceModel.login = user.accountData.login
    userServiceModel.email = user.accountData.email
    userServiceModel.passwordSalt = user.accountData.passwordSalt
    userServiceModel.passwordHash = user.accountData.passwordHash
    userServiceModel.createdAt = user.accountData.createdAt

    return userServiceModel
}