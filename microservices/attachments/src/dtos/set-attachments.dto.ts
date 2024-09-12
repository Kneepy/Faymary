import { Attachment } from "../common";
import { PreparedAttachment } from "../types";

export interface SetAttachmentsDTO extends Pick<Attachment, "parent_id" | "parent_type"> {
    attachments: PreparedAttachment[]
}