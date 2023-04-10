import { SetMetadata } from '@nestjs/common';

type TRoles = 'admin' | 'member';

export const Roles = (...roles: TRoles[]) => SetMetadata('roles', roles);
