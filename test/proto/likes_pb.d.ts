import * as jspb from 'google-protobuf'



export class Like extends jspb.Message {
  getId(): number;
  setId(value: number): Like;

  getType(): LikeType;
  setType(value: LikeType): Like;

  getState(): LikeState;
  setState(value: LikeState): Like;

  getItemId(): string;
  setItemId(value: string): Like;

  getUserId(): string;
  setUserId(value: string): Like;

  getCreatedar(): number;
  setCreatedar(value: number): Like;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Like.AsObject;
  static toObject(includeInstance: boolean, msg: Like): Like.AsObject;
  static serializeBinaryToWriter(message: Like, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Like;
  static deserializeBinaryFromReader(message: Like, reader: jspb.BinaryReader): Like;
}

export namespace Like {
  export type AsObject = {
    id: number,
    type: LikeType,
    state: LikeState,
    itemId: string,
    userId: string,
    createdar: number,
  }
}

export class AddLikeDTO extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): AddLikeDTO;

  getItemId(): string;
  setItemId(value: string): AddLikeDTO;

  getType(): LikeType;
  setType(value: LikeType): AddLikeDTO;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddLikeDTO.AsObject;
  static toObject(includeInstance: boolean, msg: AddLikeDTO): AddLikeDTO.AsObject;
  static serializeBinaryToWriter(message: AddLikeDTO, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddLikeDTO;
  static deserializeBinaryFromReader(message: AddLikeDTO, reader: jspb.BinaryReader): AddLikeDTO;
}

export namespace AddLikeDTO {
  export type AsObject = {
    userId: string,
    itemId: string,
    type: LikeType,
  }
}

export enum LikeType { 
  POST = 0,
  COMMENT = 1,
  STORY = 2,
  MESSAGE = 3,
}
export enum LikeState { 
  NOT_ACTIVE = 0,
  ACTIVE = 1,
}
