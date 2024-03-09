import {Injectable} from "@nestjs/common";
import {likeStatusType} from "../../../common/types/common.types";
import {UserRepository} from "../../user/repositories/user.repository";
import {Like} from "../domain/like.entity";
import {LikeRepository} from "../repositories/like.repository";
const { v4: uuidv4 } = require('uuid');

@Injectable()
export class LikeService {

    constructor(
        private userRepository: UserRepository,
        private likeRepository: LikeRepository
    ) {}

    async createLike(targetId: string, likeStatus: likeStatusType, userId: string, target: string) {
        const user = await this.userRepository.getUserById(userId)

        if(!user) {
            return null
        }

        const likeData = Like.create({
            id: uuidv4(),
            userId,
            login: user.accountData.login,
            targetId: targetId,
            target: target,
            addedAt: (new Date().toISOString()),
            type: likeStatus

        })

        return await this.likeRepository.createLike(likeData)
    }

    async changeLikeStatus (targetId: string, likeStatus: likeStatusType, userId: string, target: string) {
        return await this.likeRepository.updateLike(userId, targetId, likeStatus, target)
    }
}