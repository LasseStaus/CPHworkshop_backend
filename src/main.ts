import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log']
    //   if (isProduction) {
    //     return ['log', 'warn', 'error'];
    //   }
    //   return ['error', 'warn', 'log', 'verbose', 'debug'];
    // }
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
  app.enableCors({
    origin: 'http://localhost:3000' /* process.env.FRONTEND_URL, */,
    methods: ['GET, POST, PATCH, OPTIONS'],
    allowedHeaders: ['Origin, Content-type, Accept, Allow, authorization']
  })
  await app.listen(3333)
}
bootstrap()
