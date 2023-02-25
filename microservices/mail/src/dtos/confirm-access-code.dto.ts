import {AccessCodes} from "../access-codes.entity";

export class ConfirmAccessCodeDTO implements Pick<AccessCodes, "user_id" | "code"> {
    user_id: string
    code: number
}