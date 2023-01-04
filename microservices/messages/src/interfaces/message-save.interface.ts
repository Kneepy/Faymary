import { Messages } from "../common";

export interface MessageCreateInterface
    extends Omit<Partial<Messages>, "id" | "createdAt"> {}

export interface MessageUpdateInterface
    extends Omit<Partial<Messages>, "createdAt"> {}
