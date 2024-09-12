import { AttachmentType } from "../common";

/**
 * Это вложение Attachment но без обозначений родителя и его типа
 */
export interface PreparedAttachment {
    /**
     * ID элемента который прикреплён к какому либо родителю
     */
    item_id: string

    /**
     * Тип элемента который прикреплён к родителю
     */
    type: AttachmentType
}