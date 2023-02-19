/**
 * @fileoverview gRPC-Web generated client stub for likes
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.4.2
// 	protoc              v3.19.1
// source: proto/likes.proto


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as proto_likes_pb from '../proto/likes_pb';
import {ChannelCredentials} from "@grpc/grpc-js";


export class LikesServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor(hostname: string,
              credentials?: ChannelCredentials,
              options?: { [p: string]: any } | null) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorAddLike = new grpcWeb.MethodDescriptor(
    '/likes.LikesService/AddLike',
    grpcWeb.MethodType.UNARY,
    proto_likes_pb.AddLikeDTO,
    proto_likes_pb.Like,
    (request: proto_likes_pb.AddLikeDTO) => {
      return request.serializeBinary();
    },
    proto_likes_pb.Like.deserializeBinary
  );

  addLike(
    request: proto_likes_pb.AddLikeDTO,
    metadata: grpcWeb.Metadata | null): Promise<proto_likes_pb.Like>;

  addLike(
    request: proto_likes_pb.AddLikeDTO,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: proto_likes_pb.Like) => void): grpcWeb.ClientReadableStream<proto_likes_pb.Like>;

  addLike(
    request: proto_likes_pb.AddLikeDTO,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: proto_likes_pb.Like) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/likes.LikesService/AddLike',
        request,
        metadata || {},
        this.methodDescriptorAddLike,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/likes.LikesService/AddLike',
    request,
    metadata || {},
    this.methodDescriptorAddLike);
  }

}

