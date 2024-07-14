import { Users } from "src/entities"
import { UserState } from "src/user-state.enum"
import { FindManyOptions } from "typeorm"

export interface FindUserDTO {
    email: string
    userName: string
    id: string
}

export class FindUsersDTO implements Partial<Omit<Users, "email" | "id" | "state" | "password">>, Pick<FindManyOptions, "take" | "skip"> {
    fullName?: string
    userName?: string
    file_id?: string
    followers?: Users[]
    subscriptions?: Users[]
    take?: number
    skip?: number
}