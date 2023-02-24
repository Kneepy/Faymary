import { Users } from "src/entities";

<<<<<<< HEAD
export interface FindUser extends Omit<Users, "password" | "username"> {}
=======
export interface FindUser extends Omit<Users, "password"> {}

export interface FindUsers extends Omit<Users, "email" | "id"> {}
>>>>>>> c64b367a04156823befc2705327eb7aeb553abd3
