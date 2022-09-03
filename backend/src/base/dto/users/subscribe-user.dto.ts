import { IsNotEmpty, IsString } from "class-validator";

export class SubscribeUserDto {
    @IsString()
    @IsNotEmpty()
    userId: string
}