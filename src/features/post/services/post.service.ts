import {forwardRef, Inject, Injectable, Post} from "@nestjs/common";
import {CreatePostDto} from "../controller/models/create-post.dto";
import {BlogRepository} from "../../blog/repositories/blog.reposirory";
import { v4 as uuidv4 } from 'uuid';
import {Posts} from "../domain/post.entity";
import {PostRepository} from "../repositories/post.repository";
import {PostOutputModelMapper} from "../controller/models/post.output.model";
import {AllPostWithPagination, likeStatusType, QueryPostInputModel} from "../../../common/types/common.types";
import {LikeRepository} from "../../likes/repositories/like.repository";
import {CreatePostsServiceType} from "../../comment/types/comments.type";


@Injectable()
export class PostService {

    constructor(
        private blogRepository: BlogRepository,
        private postRepository: PostRepository,
        private likeRepository: LikeRepository
    ) {}

    async getPostById (postId: string, userId: string = '') {
        const post = await this.postRepository.getPostById(postId)

        if (!post) {
            return null
        }

        let status: likeStatusType | undefined
        if (userId) {
            const like = await this.likeRepository.getLike(userId, postId)
            status = like?.type
        }

        const allLikesAndDislikesForCurrentComment = await this.likeRepository.getAllLikesAndDislikesForTarget(postId)
        const likes = allLikesAndDislikesForCurrentComment.filter(item => item.type === "Like");
        const dislikes = allLikesAndDislikesForCurrentComment.filter(item => item.type === "Dislike")

        const likesFromDb = await this.likeRepository.getSortedLikesForTarget(postId)


        const newestLikes = likesFromDb.map(item => {
            return {
                addedAt: item.addedAt,
                userId: item.userId,
                login: item.login
            }
        })

        return PostOutputModelMapper(post, likes.length, dislikes.length, status, newestLikes)

    }

    async createPostService ({title, shortDescription, content, blogId}: CreatePostDto) {
        const blog = await this.blogRepository.getBlogByIdInDb(blogId)

        if (!blog) {
            return null
        }

        const newPost = Posts.create(
            uuidv4(),
            title,
            shortDescription,
            content,
            blogId,
            blog.name,
            (new Date().toISOString()),
        )

        const post = await this.postRepository.createPostInDb(newPost)

        if (!post) {
            return null
        }

        return PostOutputModelMapper(post)

    }

    async changePostByIdService ({id, title, shortDescription, content, blogId}: CreatePostsServiceType ) {
        return await this.postRepository.changePostById({id, title, shortDescription, content, blogId})
    }

    async getAllPosts (sortData: QueryPostInputModel, userId: string = '', blogId: null | string = null) {
        const posts: AllPostWithPagination = await this.postRepository.getAllPosts(sortData, userId, blogId)

        return this._mapPosts(posts, userId)

    }

    async deletePostById (id: string) {
        return await this.postRepository.deletePostById(id)
    }

    private async _mapPosts (posts: AllPostWithPagination, userId: string) {
        const mappedItems = await Promise.all(posts.items.map(async (item) => {
            let status: "Like" | "Dislike" | "None" | undefined
            console.log('userId есть', userId)
            if (userId) {
                const likeForCurrentComment = await this.likeRepository.getLike(userId, item.id);
                console.log('likeForCurrentComment есть',likeForCurrentComment)
                status = likeForCurrentComment?.type
            }


            const allLikesAndDislikesForCurrentComment = await this.likeRepository.getAllLikesAndDislikesForTarget(item.id);
            const likes = allLikesAndDislikesForCurrentComment.filter(item => item.type === "Like");
            const dislikes = allLikesAndDislikesForCurrentComment.filter(item => item.type === "Dislike");


            const likesFromDb = await this.likeRepository.getSortedLikesForTarget(item.id)


            const newestLikes = likesFromDb.map(item => {
                return {
                    addedAt: item.addedAt,
                    userId: item.userId,
                    login: item.login
                }
            })

            return {
                id: item.id,
                title: item.title,
                shortDescription: item.shortDescription,
                content: item.content,
                blogId: item.blogId,
                blogName: item.blogName,
                createdAt: item.createdAt,
                extendedLikesInfo: {
                    likesCount: likes.length ?? 0,
                    dislikesCount: dislikes.length ?? 0,
                    myStatus: status ?? "None",
                    newestLikes : newestLikes
                }
            };
        }));

        return {
            pagesCount: posts.pagesCount,
            page: posts.page,
            pageSize: posts.pageSize,
            totalCount: posts.totalCount,
            items: mappedItems
        };
    }

}