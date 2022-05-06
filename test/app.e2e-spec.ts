import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { APP_PIPE } from '@nestjs/core'

describe('App e2e', () => {
  let app: INestApplication
  beforeAll(async () => {
    //Creates a testingmodule based on our app module
    //Basically we are simulating the server - Therefore everything that is a part of the real server, should be implemented here aswell
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    )
    await app.init()
  })

  afterAll(() => {
    app.close()
  })

  it.todo('should pass')
  it.todo('should pas2')
})
