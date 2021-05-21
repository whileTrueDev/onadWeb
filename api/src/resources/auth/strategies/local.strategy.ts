import { Injectable } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { OnadSession } from '../../../interfaces/Session.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({ usernameField: 'userid', passwordField: 'passwd', passReqToCallback: true });
  }

  async validate(req: Request, userId: string, password: string): Promise<OnadSession> {
    const contextId = ContextIdFactory.getByRequest(req);
    const authService = await this.moduleRef.resolve(AuthService, contextId);

    // type 을 통해 creator, marketer 구분하여 로그인
    const { type } = req.body;
    return authService.login(type, { userId, password }); // returns User
  }
}
