import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import type { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

@Injectable()
export class RiderVerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (user?.role !== 'rider') {
      throw new ForbiddenException('Only riders may perform this action');
    }

    if (user?.riderVerification?.status !== 'approved') {
      throw new ForbiddenException(
        'Rider account is not verified. Pending or rejected NID verification.',
      );
    }

    return true;
  }
}
