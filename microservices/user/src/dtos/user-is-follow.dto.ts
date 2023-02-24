export class UserIsFollowDTO {
    owner_id:string
    user_id?: string
}

export class UsersIsFollowDTO {
    owner_id: string
    users_ids: string[]
}