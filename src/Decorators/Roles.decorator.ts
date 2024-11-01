import { SetMetadata } from "@nestjs/common";
import { USERTYPE } from "@prisma/client";

export const Roles = (...args: USERTYPE[])=> SetMetadata('roles', args);