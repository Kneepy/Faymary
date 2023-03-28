import { Users } from "src/entities";
import { UserState } from "src/user-state.enum";

export class CreateUserDTO implements Omit<Users, "id" | "followers" | "subscriptions" | "file_id" | "userName"> {
    email: string;
    fullName: string;
    password: string;
    state: UserState;
}

export class UpdateUserDTO extends Users {}