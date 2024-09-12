import { AccessCodes } from "src/access-codes.entity";

export class SendAccessCodeDTO implements Pick<AccessCodes, "user_id"> {
    user_id: string;
    email: string
}