import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import { configuration } from './config/configuration'

console.log(configuration)
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn']
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
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_PROD_FRONTEND_URL
        : process.env
            .NEXT_PUBLIC_LOCAL_FRONTEND_URL /* process.env.FRONTEND_URL, */,
    methods: ['GET, POST, PATCH, OPTIONS'],
    allowedHeaders: ['Origin, Content-type, Accept, Allow, authorization']
  })

  console.log(
    'THIS IS THE URL',
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_PROD_FRONTEND_URL
      : process.env.NEXT_PUBLIC_LOCAL_FRONTEND_URL
  )
  console.log(process.env.NODE_ENV)

  await app.listen(3333)
}
bootstrap()
