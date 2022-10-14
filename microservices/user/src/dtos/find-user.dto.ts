export enum UserFields {
    FIELD_FOLLOWERS = "followers",
    FIELD_SUBSCRIPTIONS = "subscriptions"
}

export interface FindUserCriteria {
    email: string
    lastName: string
    id: string
}

export class FindUserDTO {
    criteria: FindUserCriteria
    fields: UserFields[]
}