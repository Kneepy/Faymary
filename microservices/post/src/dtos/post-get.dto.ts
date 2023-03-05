import { Posts } from "src/entities"

export class GetManyPostsDTO implements Omit<Posts, "id" | "createdAt"> {
    file_ids: string
    desc: string
    title: string
    user_id: string
    ids: string[]
}

export class GetOnePostDTO implements Pick<Posts, "id"> {
    id: string
}