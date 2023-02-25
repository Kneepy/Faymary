import { AccessCodes } from "src/access-codes.entity";

export interface FindOneAccessCodeInterface extends Partial<Pick<AccessCodes, "id" | "user_id">> {}
