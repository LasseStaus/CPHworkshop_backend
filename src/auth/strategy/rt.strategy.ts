import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import {
    ExtractJwt,
    Strategy
} from 'passport-jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { Request } from 'express'

@Injectable()
export class RTStrategy extends PassportStrategy(
    Strategy,
    'jwt_refresh_token' //this is the key name, defaults to "jwt" if nothing is written
) {
    constructor(
        configService: ConfigService,
        private prismaService: PrismaService
    ) {
        super({
            jwtFromRequest:
                ExtractJwt.fromAuthHeaderAsBearerToken(), // how to get the token, extraxt from headers
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_RT_SECRET'), // the secret password to sign the tokens
            passReqToCallBack: true,
        })
    }

    //TODO Check video igen når han laver det her - hvorfor hedder den validate

    async validate(req: Request, payload: { // payload from token
        sub: number
        email: string
    }) {

        const refreshToken = req.get('authorization').replace('Bearer', '').trim()

        return {
            ...payload,
            refreshToken
        }

    }
}
