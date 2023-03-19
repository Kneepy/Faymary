import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from "@nestjs/common";
import { ProfilesService } from "./profiles.service";
import { Accounts, Profiles, PROFILES_SERVICE_METHODS, PROFILES_SERVICE_NAME } from './common';
import { ProfilesDTOs } from './dtos';

@Controller()
export class ProfilesController {
    constructor(
        private profilesService: ProfilesService
    ) {}

    @GrpcMethod(PROFILES_SERVICE_NAME, PROFILES_SERVICE_METHODS.GET_PROFILE)
    async getProfile(data: ProfilesDTOs.GetProfileDTO): Promise<Profiles> {
        return await this.profilesService.findOne({where: data, relations: {accounts: true}})
    }

    @GrpcMethod(PROFILES_SERVICE_NAME, PROFILES_SERVICE_METHODS.UPDATE_PROFILE)
    async updateProfile(data: ProfilesDTOs.UpdateProfileDTO): Promise<Profiles> {
        return await this.profilesService.update(data)
    }

    @GrpcMethod(PROFILES_SERVICE_NAME, PROFILES_SERVICE_METHODS.ADD_USER_ACCOUNT)
    async addUserAccount(data: ProfilesDTOs.AddUserAccountDTO): Promise<Accounts> {
        return await this.profilesService.addAccountToProfile({user_id: data.user_id}, {id: data.profile_id})
    }
    @GrpcMethod(PROFILES_SERVICE_NAME, PROFILES_SERVICE_METHODS.REMOVE_USER_ACCOUNT)
    async removeUserAccount(data: ProfilesDTOs.RemoveUserAccountDTO): Promise<Accounts> {
        return await this.profilesService.removeAccountProfile({user_id: data.user_id}, {id: data.profile_id})
    }
}