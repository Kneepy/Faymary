import { Users } from "src/entities";

<<<<<<< HEAD
export interface CreateUser extends Omit<Users, "id"> {}
=======
export interface CreateUser extends Omit<Users, "id" | "file_id" | "subscriptions" | "followers"> {}
>>>>>>> c64b367a04156823befc2705327eb7aeb553abd3

export interface UpdateUser extends Users {}