import { Attachment } from "../common";

export interface GetAttachmentsDTO extends Pick<Attachment, "parent_id" | "parent_type" | "attached_type"> {}