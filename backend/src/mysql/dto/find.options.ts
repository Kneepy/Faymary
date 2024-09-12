export type FindOptionsRelations<Entity> = {
    [P in keyof Entity]?: P extends "toString" ? unknown : undefined;
};

export class FindOneOptions<Entity> {
    relations: FindOptionsRelations<Entity> | string[];
}
