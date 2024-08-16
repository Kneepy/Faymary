export namespace LikesServiceTypes {

    export interface AddLike {
        user_id: string
        collection_id: string
    }

    export interface CheckLike {
        user_id: string
        collection_id: string
    }

    export interface CreateCollection {
        unity: string
    }

    export interface GetCollection {
        collection_id: string
    }
}