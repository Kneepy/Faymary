import { Users } from "src/entities"
import { UserState } from "src/user-state.enum"
import { FindManyOptions } from "typeorm"

export interface FindUserDTO {
    email: string
    userName: string
    id: string
}

export class FindUsersDTO implements Partial<Omit<Users, "email" | "id">>, Pick<FindManyOptions, "take" | "skip"> {
    fullName?: string
    userName?: string
    password?: string
    file_id?: string
    followers?: Users[]
    subscriptions?: Users[]
    state?: UserState
    take?: number
    skip?: number
}