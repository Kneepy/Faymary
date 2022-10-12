import { Users } from "src/entities";

export interface CreateUser extends Omit<Users, "id"> {}

export interface UpdateUser extends Users {}