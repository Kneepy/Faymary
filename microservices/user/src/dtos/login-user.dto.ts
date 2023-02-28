import { Users } from "src/entities";

export class LoginUserDTO implements Pick<Users, "email" | "password"> {
    email: string;
    password: string;
}