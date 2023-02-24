import { Users } from "src/entities";
import { UserState } from "src/user-state.enum";

<<<<<<< HEAD
export class CreateUserDTO implements Omit<Users, "id" | "followers" | "subscriptions"> {
=======
export class CreateUserDTO implements Omit<Users, "id" | "followers" | "subscriptions" | "file_id"> {
>>>>>>> c64b367a04156823befc2705327eb7aeb553abd3
    email: string;
    userName: string;
    lastName: string;
    password: string;
    state: UserState;
<<<<<<< HEAD
}
=======
}

export class UpdateUserDTO extends Users {}
>>>>>>> c64b367a04156823befc2705327eb7aeb553abd3
