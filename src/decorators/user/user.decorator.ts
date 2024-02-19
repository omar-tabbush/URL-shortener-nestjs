import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const User = createParamDecorator(
  (
    data: string | { prop: string; throwIfNotExist: boolean },
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!data) {
      return user;
    }
    if (typeof data === 'string') {
      return data ? user?.[data] : user;
    }
    if (data.throwIfNotExist && !user?.[data.prop]) {
      throw new BadRequestException('User not found');
    }
    return data?.prop ? user?.[data.prop] : user;
  },
);
