import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { CreatorSession, MarketerSession } from '../interfaces/Session.interface';

/**
 * 요청으로부터 광고주 세션 데이터를 가져옵니다.
 * 세션 데이터가 없거나 방송인의 세션인 경우, UnauthorizedException 오류를 던집니다.
 * @주의 **UseGaurd(IsAuthGuard) 로 세션이 있는지 확인한 뒤에 사용하여야 더 안전합니다.**
 * @example
 * someControllerMethod(@Marketer() marketerSession: MarketerSession) {}
 * someControllerMethod(@Marketer() { marketerId }: MarketerSession) {}
 * @returns {MarketerSession}
 */
export const Marketer = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (request.user.userType === 'marketer') return request.user as MarketerSession;
  throw new UnauthorizedException();
});

/**
 * 요청으로부터 방송인 세션 데이터를 가져옵니다.
 * 세션 데이터가 없거나 광고주의 세션인 경우, UnauthorizedException 오류를 던집니다.
 * @주의 **UseGaurd(IsAuthGuard) 로 세션이 있는지 확인한 뒤에 사용하여야 더 안전합니다.**
 * @example
 * someControllerMethod(@Creator() creatorSession: CreatorSession) {}
 * someControllerMethod(@Creator() { creatorId }: CreatorSession) {}
 * @returns {MarketerSession}
 */
export const Creator = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (request.user.userType === 'creator') return request.user as CreatorSession;
  throw new UnauthorizedException();
});
