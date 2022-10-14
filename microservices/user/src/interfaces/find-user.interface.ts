import { Users } from "src/entities";

export interface FindUser extends Omit<Users, "password" | "username"> {}