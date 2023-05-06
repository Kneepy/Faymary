import { Messages } from "src/common";
import { FindOptionsWhere } from "typeorm";

export interface MessageFindOneInterface extends Pick<Messages, "id"> {}

export interface MessageFindManyInterface
    extends Omit<FindOptionsWhere<Messages>, "id"> {}
