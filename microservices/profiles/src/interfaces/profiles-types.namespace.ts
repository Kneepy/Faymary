import { Profiles } from "src/common";
import { FindOneOptions } from "typeorm";

export namespace ProfilesTypes {
    export interface CreateProfileInterface extends Pick<Profiles, "user_id"> {}
    export interface GetProfileInterface extends FindOneOptions<Profiles> {}
    export interface UpdateProfileInterface extends Profiles {}
}