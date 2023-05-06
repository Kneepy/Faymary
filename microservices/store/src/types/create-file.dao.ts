import { File } from "src/entities";

export type CreateFileDAO = Omit<File, "id" | "createdAt">