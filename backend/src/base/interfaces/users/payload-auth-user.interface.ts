import { Users } from "src/entity/users.entity";

export interface PayloadAuthUser {
    user: Users;
    token: string;
}
