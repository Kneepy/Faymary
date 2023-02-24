<<<<<<< HEAD
export enum UserFields {
    FIELD_FOLLOWERS = "followers",
    FIELD_SUBSCRIPTIONS = "subscriptions"
}

export interface FindUserCriteria {
    email: string
    lastName: string
    id: string
}

export class FindUserDTO {
    criteria: FindUserCriteria
    fields: UserFields[]
=======
import { Users } from "src/entities"
import { UserState } from "src/user-state.enum"
import { FindManyOptions } from "typeorm"

export interface FindUserDTO {
    email: string
    lastName: string
    id: string
    addSubs: boolean
}

export class FindUsersDTO implements Partial<Omit<Users, "email" | "id">>, Pick<FindManyOptions, "take" | "skip"> {
    userName?: string
    lastName?: string
    password?: string
    file_id?: string
    followers?: Users[]
    subscriptions?: Users[]
    state?: UserState
    take?: number
    skip?: number
    addSubs: boolean
>>>>>>> c64b367a04156823befc2705327eb7aeb553abd3
}