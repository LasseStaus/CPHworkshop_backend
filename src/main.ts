import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose']
    //   if (isProduction) {
    //     return ['log', 'warn', 'error'];
    //   }
    //   return ['error', 'warn', 'log', 'verbose', 'debug'];
    // }
    // hej
  })
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({
      // enforce dto declared validation rules for all incoming client requests
      stopAtFirstError: true,
      whitelist: true, // Strips out the fields that are not defined by the dto
      transform: true
    })
  )

  const whitelist = [process.env.NEXT_PUBLIC_FRONTEND_URL]
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET, POST, PATCH, OPTIONS'],
    credentials: true,
    allowedHeaders: ['Origin, Content-type, Accept, Allow, authorization']
  })
  await app.listen(process.env.PORT)
}
bootstrap()
