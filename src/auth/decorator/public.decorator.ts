import { SetMetadata } from "@nestjs/common";

export const PublicPath = () => SetMetadata('isPublic', true);