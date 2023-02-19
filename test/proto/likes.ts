/* eslint-disable */
import * as  from "long";
import * as _m0 from "protobufjs/minimal";

export const rotobufPackage = "likes";

export enum LikeType {
  POST = 0,
  COMMENT = 1,
  STORY = 2,
  MESSAGE = 3,
  UNRECOGNIZED = -1,
}

export function likeTypeFromJSON(object: any): LikeType {
  switch (object) {
    case 0:
    case "POST":
      return LikeType.POST;
    case 1:
    case "COMMENT":
      return LikeType.COMMENT;
    case 2:
    case "STORY":
      return LikeType.STORY;
    case 3:
    case "MESSAGE":
      return LikeType.MESSAGE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return LikeType.UNRECOGNIZED;
  }
}

export function likeTypeToJSON(object: LikeType): string {
  switch (object) {
    case LikeType.POST:
      return "POST";
    case LikeType.COMMENT:
      return "COMMENT";
    case LikeType.STORY:
      return "STORY";
    case LikeType.MESSAGE:
      return "MESSAGE";
    case LikeType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum LikeState {
  NOT_ACTIVE = 0,
  ACTIVE = 1,
  UNRECOGNIZED = -1,
}

export function likeStateFromJSON(object: any): LikeState {
  switch (object) {
    case 0:
    case "NOT_ACTIVE":
      return LikeState.NOT_ACTIVE;
    case 1:
    case "ACTIVE":
      return LikeState.ACTIVE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return LikeState.UNRECOGNIZED;
  }
}

export function likeStateToJSON(object: LikeState): string {
  switch (object) {
    case LikeState.NOT_ACTIVE:
      return "NOT_ACTIVE";
    case LikeState.ACTIVE:
      return "ACTIVE";
    case LikeState.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Like {
  id: number;
  type: LikeType;
  state: LikeState;
  itemId: string;
  userId: string;
  createdAr: number;
}

export interface AddLikeDTO {
  userId: string;
  itemId: string;
  type: LikeType;
}

function createBaseLike(): Like {
  return { id: 0, type: 0, state: 0, itemId: "", userId: "", createdAr: 0 };
}

export const Like = {
  encode(message: Like, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int64(message.id);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.state !== 0) {
      writer.uint32(24).int32(message.state);
    }
    if (message.itemId !== "") {
      writer.uint32(34).string(message.itemId);
    }
    if (message.userId !== "") {
      writer.uint32(42).string(message.userId);
    }
    if (message.createdAr !== 0) {
      writer.uint32(48).int64(message.createdAr);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Like {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLike();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.type = reader.int32() as any;
          break;
        case 3:
          message.state = reader.int32() as any;
          break;
        case 4:
          message.itemId = reader.string();
          break;
        case 5:
          message.userId = reader.string();
          break;
        case 6:
          message.createdAr = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Like {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      type: isSet(object.type) ? likeTypeFromJSON(object.type) : 0,
      state: isSet(object.state) ? likeStateFromJSON(object.state) : 0,
      itemId: isSet(object.itemId) ? String(object.itemId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      createdAr: isSet(object.createdAr) ? Number(object.createdAr) : 0,
    };
  },

  toJSON(message: Like): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.type !== undefined && (obj.type = likeTypeToJSON(message.type));
    message.state !== undefined && (obj.state = likeStateToJSON(message.state));
    message.itemId !== undefined && (obj.itemId = message.itemId);
    message.userId !== undefined && (obj.userId = message.userId);
    message.createdAr !== undefined && (obj.createdAr = Math.round(message.createdAr));
    return obj;
  },

  create<I extends Exact<DeepPartial<Like>, I>>(base?: I): Like {
    return Like.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Like>, I>>(object: I): Like {
    const message = createBaseLike();
    message.id = object.id ?? 0;
    message.type = object.type ?? 0;
    message.state = object.state ?? 0;
    message.itemId = object.itemId ?? "";
    message.userId = object.userId ?? "";
    message.createdAr = object.createdAr ?? 0;
    return message;
  },
};

function createBaseAddLikeDTO(): AddLikeDTO {
  return { userId: "", itemId: "", type: 0 };
}

export const AddLikeDTO = {
  encode(message: AddLikeDTO, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.itemId !== "") {
      writer.uint32(18).string(message.itemId);
    }
    if (message.type !== 0) {
      writer.uint32(24).int32(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddLikeDTO {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddLikeDTO();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.itemId = reader.string();
          break;
        case 3:
          message.type = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddLikeDTO {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      itemId: isSet(object.itemId) ? String(object.itemId) : "",
      type: isSet(object.type) ? likeTypeFromJSON(object.type) : 0,
    };
  },

  toJSON(message: AddLikeDTO): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.itemId !== undefined && (obj.itemId = message.itemId);
    message.type !== undefined && (obj.type = likeTypeToJSON(message.type));
    return obj;
  },

  create<I extends Exact<DeepPartial<AddLikeDTO>, I>>(base?: I): AddLikeDTO {
    return AddLikeDTO.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AddLikeDTO>, I>>(object: I): AddLikeDTO {
    const message = createBaseAddLikeDTO();
    message.userId = object.userId ?? "";
    message.itemId = object.itemId ?? "";
    message.type = object.type ?? 0;
    return message;
  },
};

export interface LikesService {
  AddLike(request: AddLikeDTO): Promise<Like>;
}

export class LikesServiceClientImpl implements LikesService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "likes.LikesService";
    this.rpc = rpc;
    this.AddLike = this.AddLike.bind(this);
  }
  AddLike(request: AddLikeDTO): Promise<Like> {
    const data = AddLikeDTO.encode(request).finish();
    const promise = this.rpc.request(this.service, "AddLike", data);
    return promise.then((data) => Like.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
