import { SetMetadata } from '@nestjs/common';

export const RequiredPermission = (level: number) => SetMetadata('requiredPermission', level);
