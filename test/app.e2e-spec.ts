import { INestApplication, ValidationPipe } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { LoginDto, SignupDto } from 'src/auth/dto'
import { EditUserDto } from 'src/user/dto'
import { PrismaService } from '../src/prisma/prisma.service'
import { AppModule } from './../src/app.module'

describe('App e2e', () => {
  // Initializes the variables and types used during testing
  let app: INestApplication
  let prismaService: PrismaService
  let jwtService: JwtService
  let invalidBearerToken: string
  let signupDto: SignupDto
  let loginDto: LoginDto
  let editUserDto: EditUserDto

  // Defines the setup that will simulate the entirety of the real server
  beforeAll(async () => {
    // Compiles an instance of a testing module, that imports the entirety of our application.
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    // Initializes the compiled module into an application instance
    app = moduleRef.createNestApplication()
    // Initializes the validaton pipes uses for class validators
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    )
    //Creates test application
    await app.init()
    //Launches the server on port 3333
    await app.listen(3333)

    prismaService = app.get(PrismaService)
    jwtService = app.get(JwtService)

    //not sure if used??
    await prismaService.cleanDb()
    //Sets baseURL of requests for all pactum requests used in testing
    pactum.request.setBaseUrl('http://localhost:3333')
  })

  beforeEach(async () => {
    // Valid DTO for login
    loginDto = {
      email: 'test@gmail.com',
      password: '232323AAAaaa'
    }
    // Valid DTO for login
    signupDto = {
      email: 'test@gmail.com',
      password: '232323AAAaaa',
      firstname: 'lasse',
      lastname: 'stausgaard',
      phonenumber: '23232323',
      passwordConfirm: '232323AAAaaa'
    }
    // Valid DTO for editing user information
    editUserDto = {
      email: 'newmail@gmail.com',
      firstname: 'NewFirstname',
      lastname: 'NewLastname'
    }

    async function getBearerToken(id: number) {
      return jwtService.signAsync({
        sub: id.toString(),
        email: signupDto.email
      })
    }
    jwtService = new JwtService({
      secret: 'someRandomSecret',
      signOptions: { expiresIn: '15m' }
    })
    // JWT token used for both invalid Access and refresh token.
    // Is generated with a secret that is different from the .env secrets
    invalidBearerToken = await getBearerToken(1)
  })

  //closes the applicaton after all tests are ran
  afterAll(() => {
    app.close()
  })

  describe('Auth e2e test', () => {
    describe('Signup user', () => {
      it('Can NOT signup without valid body', () => {
        return pactum.spec().post('/auth/local/signup').expectStatus(400)
      })
      it('Can NOT signup with invalid email', () => {
        const { email, ...noEmailDto } = signupDto
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody(noEmailDto)
          .expectStatus(400)
      })
      it('Can NOT signup with invalid password', () => {
        const { password, ...noPasswordDTO } = signupDto
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody(noPasswordDTO)
          .expectStatus(400)
      })
      it('Can signup with valid body', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody(signupDto)
          .expectStatus(201)
          .inspect()
      })
    })

    describe('Login user', () => {
      it('Can NOT log in with invalid body', () => {
        return pactum.spec().post('/auth/local/signin').expectStatus(400)
      })
      it('Can log in with valid body', () => {
        return (
          pactum
            .spec()
            .post('/auth/local/signin')
            .withBody(loginDto)
            .expectStatus(200)
            .stores('user_access_token', 'access_token')
            .stores('user_refresh_token', 'refresh_token')
            //Storing valid AT and RT for further tests in the flow
            .expectBodyContains('access_token')
            .expectBodyContains('refresh_token')
            .inspect()
          //ensuring that access and refresh token was returned
        )
      })
    })
    describe('Post refresh token', () => {
      it('Can NOT read refresh token with invalid token secret', () => {
        return pactum
          .spec()
          .post('/auth/refresh')
          .withHeaders({ Authorization: `Bearer ${invalidBearerToken}` })
          .expectStatus(401)
      })
      it('Can create new tokens with valid refreshtoken', () => {
        return pactum
          .spec()
          .post('/auth/refresh')
          .withHeaders({ Authorization: 'Bearer $S{user_refresh_token}' })
          .expectStatus(200)
          .expectBodyContains('access_token')
          .expectBodyContains('refresh_token')
        //ensuring that access and refresh token was returned
      })
    })
  })
  describe('User e2e test', () => {
    describe('Get user data', () => {
      it('Can NOT get user data without access token', () => {
        return pactum.spec().get('/user/profile').expectStatus(401)
      })
      it('Can NOT user data with invalid access token', () => {
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
          .expectBodyContains(signupDto.email)
          .expectBodyContains(signupDto.phonenumber)
          .expectBodyContains(signupDto.firstname)
          .expectBodyContains(signupDto.lastname)
          //ensuring that correct data is returned
          .inspect()
      })
    })

    describe('Can edit user data', () => {
      it('Can NOT edit user data without access token', () => {
        return pactum.spec().patch('/user/edit').expectStatus(401)
      })
      it('Can NOT edit user data with invalid access token', () => {
        return pactum
          .spec()
          .patch('/user/edit')
          .withHeaders({ Authorization: `Bearer ${invalidBearerToken}` })
          .withBody(editUserDto)
          .expectStatus(401)
      })
      it('Can edit user data with valid access token', () => {
        return pactum
          .spec()
          .patch('/user/edit')
          .withBody(editUserDto)
          .withHeaders({ Authorization: 'Bearer $S{user_access_token}' })
          .expectStatus(200)
      })
      it('Can get updated/edited user data with valid access token', () => {
        expect(loginDto.email).not.toEqual(editUserDto.email)
        return pactum
          .spec()
          .get('/user/profile')
          .withHeaders({ Authorization: 'Bearer $S{user_access_token}' })
          .expectStatus(200)
          .expectBodyContains(editUserDto.email)
          .expectBodyContains(editUserDto.firstname)
          .expectBodyContains(editUserDto.lastname)
        //ensuring that the user was updated by expecting the editUserDto data from the response
      })
    })
  })
  describe('Logout user', () => {
    it('Can NOT log out without access token', () => {
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
