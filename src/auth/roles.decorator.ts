import { SetMetadata } from '@nestjs/common';

// Custom decorator to attach required roles metadata to route handlers
export const roles = (...roles: string[]) => SetMetadata('roles', roles);
