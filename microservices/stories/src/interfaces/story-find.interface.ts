import { FindOperator } from "typeorm";
import { Story } from "src/entities";

export interface FindStoryInterface extends Pick<Story, "id"> {}

export interface FindManyStoryInterface extends Story {}
