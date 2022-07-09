import { IsEmail, IsString, Length, IsNotEmpty } from "class-validator";

export class UsersInput {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @Length(7)
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    surname: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;
}
