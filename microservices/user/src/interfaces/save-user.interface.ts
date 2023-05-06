import { Users } from "src/entities";

export interface CreateUser extends Omit<Users, "id" | "file_id" | "subscriptions" | "followers"> {}

export interface UpdateUser extends Users {}