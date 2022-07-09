import { IsString, IsUUID, IsEmail } from "class-validator";

export class UsersArgs {
    @IsString()
    @IsUUID()
    id: string;

    @IsString()
    lastName: string;

    @IsString()
    @IsEmail()
    email: string;
}
