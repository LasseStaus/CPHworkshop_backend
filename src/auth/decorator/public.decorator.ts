import { SetMetadata } from '@nestjs/common'

// returns the code to set meta data and isPublic to true to create a public path
// Paths that are nu used by the global AtGuard
export const PublicPath = () => SetMetadata('isPublic', true)
