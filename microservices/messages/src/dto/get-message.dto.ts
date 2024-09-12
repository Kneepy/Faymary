import { Messages } from "src/common";

export class GetMessageDTO implements Pick<Messages, "id"> {
    id: string;
}