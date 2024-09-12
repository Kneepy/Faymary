import { Users } from "src/entities";
import { UserIsFollowInterface } from "./user-is-follow.interface";

export interface FollowUserInterface extends UserIsFollowInterface {
    author: Users
}