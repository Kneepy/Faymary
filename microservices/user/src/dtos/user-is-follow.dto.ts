export class UserIsFollowDTO {
    author_id:string
    user_id?: string
}

export class UsersIsFollowDTO {
    author_id: string
    users_ids: string[]
}