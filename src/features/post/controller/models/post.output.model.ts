
import {PostDocument} from "../../domain/post.entity";
import {likeStatusType, NewestLikeType} from "../../../../common/types/common.types";

class newestLikes {
    addedAt: string
    userId: string
    login: string
}

export class PostOutputModel {
    id:	string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    userId: string
    userName: string
    imageUrl: string
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: "Like" | "Dislike" | "None",
        newestLikes : newestLikes []
    }
}

export class PostOutputModelWithPagination {
    pagesCount?: number
    page?: number
    pageSize?: number
    totalCount?: number
    items: PostOutputModel[]
}


export const PostOutputModelMapper = (
    post: PostDocument,
    likesCount = 0,
    dislikesCount= 0,
    myStatus: likeStatusType = "None",
    newestLikes: NewestLikeType[] = []
    ): PostOutputModel => {
    const outputModel = new PostOutputModel();

    outputModel.id = post.id;
    outputModel.title = post.title;
    outputModel.shortDescription = post.shortDescription;
    outputModel.content = post.content;
    outputModel.blogId = post.blogId;
    outputModel.blogName = post.blogName;
    outputModel.createdAt = post.createdAt;
    outputModel.userId = post.userId;
    outputModel.userName = post.userName;
    outputModel.imageUrl = post.imageUrl

    outputModel.extendedLikesInfo = {
        likesCount,
        dislikesCount,
        myStatus,
        newestLikes
    }


    return outputModel;
};