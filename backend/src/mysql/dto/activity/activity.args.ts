import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
import { Users } from "src/entity/users.entity";

export class ActivityArgs {
    @IsOptional()
    @IsNumber()
    id: number;

    @Type(() => Users)
    @IsOptional()
    user: Users;
}
