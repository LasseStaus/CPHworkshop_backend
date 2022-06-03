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

  console.log('Test log of API main', process.env.NEXT_PUBLIC_FRONTEND_URL)

  app.enableCors({
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL,
    methods: ['GET, POST, PATCH, OPTIONS'],
    allowedHeaders: ['Origin, Content-type, Accept, Allow, authorization']
  })
  await app.listen(process.env.PORT || 3333)
}
bootstrap()
