import { File } from "../entities"

export interface GetFileDTO extends Pick<File, "id"> {}