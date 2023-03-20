import { Users } from "src/entities"
import { UserState } from "src/user-state.enum"
import { FindManyOptions } from "typeorm"

export interface FindUserDTO {
    email: string
    lastName: string
    id: string
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
}