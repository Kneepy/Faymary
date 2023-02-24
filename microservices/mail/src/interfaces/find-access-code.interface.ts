import { AccessCodes } from "src/access-codes.entity";

export interface FindOneAccessCodeInterface extends Pick<AccessCodes, "id"> {}
