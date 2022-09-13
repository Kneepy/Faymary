import { IsNotEmpty } from "class-validator";
import { Posts } from "src/entity";

export class UpdatePostDto extends Posts {
    @IsNotEmpty()
    id: string
}