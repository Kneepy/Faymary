import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { Users } from "src/entity";

export class FilesInput {
    @IsNotEmpty()
    path: string;

    @Type(() => Users)
    @IsNotEmpty()
    user: Users;
}
