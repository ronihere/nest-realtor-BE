import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { USERTYPE } from "@prisma/client";
import { Response } from "express";
import * as jwt from 'jsonwebtoken';

export interface TokenUserInterface {
  id: string,
  email: string,
  name: string,
  type: USERTYPE,
  iat: number,
  exp: number
}

@Injectable()
export class Userinterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    const authToken = request.headers?.['authorization']?.split("Bearer ")?.[1];
    const user = jwt.decode(authToken) as TokenUserInterface;
    request.user = user;
    return next.handle()
  }
}