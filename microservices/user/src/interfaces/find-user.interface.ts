import { Users } from "src/entities";

export interface FindUser extends Omit<Users, "password"> {}

export interface FindUsers extends Omit<Users, "email" | "id"> {}