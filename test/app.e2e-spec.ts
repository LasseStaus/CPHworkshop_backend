import { INestApplication, ValidationPipe } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { LoginDto, SignupDto } from 'src/auth/dto'
import { EditUserDto } from 'src/user/dto'
import { PrismaService } from '../src/prisma/prisma.service'
import { AppModule } from './../src/app.module'

describe('App e2e', () => {
  let app: INestApplication
  let prismaService: PrismaService
  let jwtService: JwtService
  let invalidBearerToken: string
  let signupDto: SignupDto
  let loginDto: LoginDto
  let editUserDto: EditUserDto

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
    //Create test application
    await app.init()
    //Start server
    await app.listen(3333)

    prismaService = app.get(PrismaService)

    await prismaService.cleanDb()
    pactum.request.setBaseUrl('http://localhost:3333')
  })

  beforeEach(async () => {
    async function getBearerToken(id: number) {
      return jwtService.signAsync({
        sub: id.toString(),
        email: 'test@gmail.com'
      })
    }
    jwtService = new JwtService({
      secret: 'someRandomSecret',
      signOptions: { expiresIn: '15m' }
    })
    invalidBearerToken = await getBearerToken(1)

    loginDto = {
      email: 'test@gmail.com',
      password: '232323AAAaaa'
    }
    signupDto = {
      email: 'test@gmail.com',
      password: '232323AAAaaa',
      firstname: 'lasse',
      lastname: 'stausgaard',
      phonenumber: '23232323',
      passwordConfirm: '232323AAAaaa'
    }
    editUserDto = {
      email: 'newmail@gmail.com',
      firstName: 'NewFirstname',
      lastName: 'NewLastname'
    }
  })
  afterAll(() => {
    app.close()
  })

  describe('Auth e2e test', () => {
    describe('Signup user', () => {
      it('Can NOT signup if provided no body', async () => {
        return pactum.spec().post('/auth/local/signup').expectStatus(400)
      })
      it('Can NOT signup without valid email', async () => {
        const { email, ...noEmailDto } = signupDto
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody(noEmailDto)
          .expectStatus(400)
      })

      it('Can NOT signup without valid passowrd', async () => {
        const { password, ...noPasswordDTO } = signupDto
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody(noPasswordDTO)
          .expectStatus(400)
      })
      it('Can signup with valid credentials', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody(signupDto)
          .expectStatus(201)
      })
    })
    describe('Login user', () => {
      it('Can NOT log in without valid credentials', () => {
        return pactum.spec().post('/auth/local/signin').expectStatus(400)
      })
      it('Can log in with valid credentials', () => {
        return pactum
          .spec()
          .post('/auth/local/signin')
          .withBody(loginDto)
          .expectStatus(200)
          .stores('user_access_token', 'access_token')
          .stores('user_refresh_token', 'refresh_token')
      })
    })
    describe('Post refresh token', () => {
      it('Can NOT read refresh token with wrong secret', () => {
        return pactum
          .spec()
          .post('/auth/refresh')
          .withHeaders({ Authorization: `Bearer ${invalidBearerToken}` })
          .expectStatus(401)
      })
      it('Can get new tokens if valid refresh token', () => {
        return pactum
          .spec()
          .post('/auth/refresh')
          .withHeaders({ Authorization: 'Bearer $S{user_refresh_token}' })
          .expectStatus(200)
      })
    })
  })
  describe('User e2e test', () => {
    describe('Get user data', () => {
      it('Can NOT get user data without access token', () => {
        return pactum.spec().get('/user/profile').expectStatus(401)
      })
      it('Can NOT get user data with invalid access token', () => {
        return pactum
          .spec()
          .get('/user/profile')
          .withHeaders({ Authorization: `Bearer ${invalidBearerToken}` })
          .expectStatus(401)
      })
      it('Can get user data with valid access token', () => {
        return pactum
          .spec()
          .get('/user/profile')
          .withHeaders({ Authorization: 'Bearer $S{user_access_token}' })
          .expectStatus(200)
          .expectBodyContains(loginDto.email)
      })
    })
    describe('Can edit user data', () => {
      it('Can NOT edit user data without access token', () => {
        return pactum.spec().patch('/user/edit').expectStatus(401)
      })
      it('Can edit user data with valid access token', () => {
        return pactum
          .spec()
          .patch('/user/edit')
          .withHeaders({ Authorization: 'Bearer $S{user_access_token}' })
          .expectStatus(200)
      })
      it('Can edit user data with valid access token', () => {
        return pactum
          .spec()
          .patch('/user/edit')
          .withHeaders({ Authorization: 'Bearer $S{user_access_token}' })
          .withBody(editUserDto)
          .expectStatus(200)
      })
      it('Can see NEW user data with valid access token', () => {
        expect(loginDto.email).not.toEqual(editUserDto.email)
        return pactum
          .spec()
          .get('/user/profile')
          .withHeaders({ Authorization: 'Bearer $S{user_access_token}' })
          .expectStatus(200)
          .expectBodyContains(editUserDto.email)
      })
    })
  })
  describe('Logout user', () => {
    it('Can NOT log out with no access token', () => {
      return pactum.spec().post('/auth/logout').expectStatus(401)
    })
    it('Can NOT log out with invalid access token', () => {
      return pactum
        .spec()
        .post('/auth/logout')
        .withHeaders({ Authorization: `Bearer ${invalidBearerToken}` })
        .expectStatus(401)
    })
    it('Can log out with valid access token', () => {
      return pactum
        .spec()
        .post('/auth/logout')
        .withHeaders({ Authorization: 'Bearer $S{user_access_token}' })
        .expectStatus(200)
    })
  })
  describe('Bookings', () => {
    it.todo('should test all bookings')
  })
})
