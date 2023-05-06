import { AccessCodes } from "src/access-codes.entity";

export interface CreateAccessCodeInterface extends Omit<AccessCodes, "id" | "createdAt"> {}