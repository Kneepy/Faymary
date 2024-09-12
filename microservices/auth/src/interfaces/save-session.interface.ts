import { Sessions } from "src/entities";

export interface CreateSession extends Omit<Sessions, "id" | "createdAt"> {}
