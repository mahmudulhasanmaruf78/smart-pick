import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        // Read the required roles attached by @roles(...) decorator
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true; // Public route, allow access
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Attached by JwtStrategy
        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException(
                'You do not have permission to access this resource',
            );
        }
        return true;
    }
}