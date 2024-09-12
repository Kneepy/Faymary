import { Attachment } from "../common";

export interface AddAttachmentsDTO extends Omit<Attachment, "id"> {}