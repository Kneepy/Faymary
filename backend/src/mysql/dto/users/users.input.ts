import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class UsersInput {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;
}
