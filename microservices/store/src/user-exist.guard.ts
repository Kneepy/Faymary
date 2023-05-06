import { USER_ID_NOT_FOUND } from './constants/errors.constants';
import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { HttpStatus } from '@nestjs/common';
import { ICustomRequest, ICustomResponse } from 'src/types';
import { CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class UserExistHttp implements CanActivate {
    constructor(private httpAdapterHost: HttpAdapterHost) {}

    canActivate(context: ExecutionContext): boolean {
        const res = context.switchToHttp().getResponse<ICustomResponse>()
        const req = context.switchToHttp().getRequest<ICustomRequest>()

        if(!req.query.user_id) throw new UnauthorizedException(USER_ID_NOT_FOUND)
        else return true
    }
}