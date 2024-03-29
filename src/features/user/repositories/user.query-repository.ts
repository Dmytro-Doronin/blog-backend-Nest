import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {User} from "../domain/user.entity";
import {Model} from "mongoose";
import {QueryUserInputModel} from "../../../common/types/common.types";
import {filterForSort} from "../../../common/utils/filterForSort";
import {UserOutputMapper} from "../controller/models/user.output-model";

@Injectable()
export class UserQueryRepository {

    constructor(@InjectModel(User.name)  private UserModel: Model<User>) {}


    async findUserByLoginOrEmail (loginOrEmail: string) {
        try {
            const user = await this.UserModel.findOne({$or: [{'accountData.email':loginOrEmail },{'accountData.login': loginOrEmail}]})

            if (!user) {
                return null
            }

            return UserOutputMapper(user)
        } catch (e) {
            throw new Error('User was not found')
        }

    }

    async getAllUser (sortData: QueryUserInputModel) {
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection  = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10
        const searchLoginTerm = sortData.searchLoginTerm ?? null
        const searchEmailTerm = sortData.searchEmailTerm ?? null

        let filter: any = {$or: []};
        if (searchEmailTerm) {
            filter['$or']?.push({'accountData.email': {$regex: searchEmailTerm, $options: 'i'}});
        }
        if (searchLoginTerm) {
            filter['$or']?.push({'accountData.login': {$regex: searchLoginTerm, $options: 'i'}});
        }
        if (filter['$or']?.length === 0) {
            filter['$or']?.push({});
        }


        try {
            const users = await this.UserModel
                .find(filter)
                .sort(filterForSort(sortBy, sortDirection))
                .skip((+pageNumber - 1) * +pageSize)
                .limit(+pageSize)

            const totalCount = await this.UserModel.countDocuments(filter)
            const pagesCount = Math.ceil(totalCount / +pageSize)

            return {
                pagesCount,
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount,
                items: users.map(UserOutputMapper)
            }

        } catch (e) {
            throw new Error('users was not get ')
        }
    }

    async getUserById (userId: string) {
        try {
            const user = await this.UserModel.findOne({id: userId})

            if(!user) {
                return null
            }
            return UserOutputMapper(user)
        } catch (e) {
            throw new Error('Does not get user')
        }
    }

}