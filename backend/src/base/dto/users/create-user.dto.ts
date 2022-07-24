import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsOptional
} from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @MinLength(7)
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsOptional()
    surname: string;
}
