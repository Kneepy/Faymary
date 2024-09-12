import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Accounts, Profiles } from './common';
import { ProfilesTypes } from './interfaces';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(Profiles) private profileRepository: Repository<Profiles>,
        @InjectRepository(Accounts) private accountsRepository: Repository<Accounts>,
    ) {}

    async addAccountToProfile(account: Pick<Accounts, "user_id">, profile: Pick<Profiles, "id">): Promise<Accounts | null> {
        if(!profile.id || !account.user_id) return null

        const existAccount = await this.accountsRepository.findOne({where: {user_id: account.user_id, profile: {id: profile.id}}})

        return existAccount ?? await this.accountsRepository.save({user_id: account.user_id, profile: profile})
    }
    async removeAccountProfile(account: Pick<Accounts, "user_id">, profile: Pick<Profiles, "id">): Promise<Accounts | null> {
        if(!profile.id || !account.user_id) return null

        const userAccount = await this.accountsRepository.findOne({where: {user_id: account.user_id, profile: {id: profile.id}}})

        if(!userAccount) return null
        
        await this.accountsRepository.delete(userAccount.id)
        return userAccount
    }

    async create(data: ProfilesTypes.CreateProfileInterface): Promise<Profiles> {
        return await this.profileRepository.save(data)
    }
    async findOne(data: ProfilesTypes.GetProfileInterface): Promise<Profiles> {
        return await this.profileRepository.findOne(data)
    }
    async delete(id: string): Promise<any> {
        return await this.profileRepository.delete(id)
    }
    async update(data: Profiles): Promise<Profiles> {
        return await this.profileRepository.save(data)
    }
}