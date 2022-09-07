import { Users } from "src/entity/users/users.entity";

export interface PayloadAuthUser {
    user: Users;
    token: string;
}
