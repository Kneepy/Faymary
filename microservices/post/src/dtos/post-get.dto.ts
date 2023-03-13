import { Posts } from "src/entities"

export class GetManyPostsDTO implements Omit<Posts, "id" | "createdAt"> {
    user_id: string
    file_ids: string
    msg: string

    // other fields
    ids: string[]
    take: number
    skip: number
}

export class GetOnePostDTO implements Pick<Posts, "id"> {
    id: string
}