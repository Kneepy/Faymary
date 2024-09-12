import { Accounts, Profiles } from "src/common";

export namespace ProfilesDTOs {
    export class GetProfileDTO implements Pick<Profiles, "user_id"> {
        user_id: string;
    }
    export class CreateProfileDTO implements Pick<Profiles, "user_id"> {
        user_id: string;
    }
    export class UpdateProfileDTO extends Profiles {}
    export class AddUserAccountDTO implements Pick<Accounts, "user_id"> {
        user_id: string;
        profile_id: string;
    }
    export class RemoveUserAccountDTO implements Pick<Accounts, "user_id"> {
        user_id: string;
        profile_id: string;
    }
}