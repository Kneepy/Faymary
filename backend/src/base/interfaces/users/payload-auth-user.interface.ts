import { Users } from "src/entity"

export interface PayloadAuthUser {
    user: Users
    token: string   
}