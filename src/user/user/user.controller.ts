import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpRedirectResponse,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { User } from '@prisma/client';
import { ValidationFilter } from '../../validation/validation.filter';
import { ValidationPipe } from '../../validation/validation.pipe';
import {
  LoginUserRequest,
  loginUserRequestValidation,
} from '../../model/login.model';
import { TimeInterceptor } from '../../time/time.interceptor';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../role/roles.decorator';

@Controller('/api/users')
export class UserController {
  constructor(
    private services: UserService,
    private connection: Connection,
    private mailService: MailService,

    @Inject('EmailService')
    private emailService: MailService,

    private userRepository: UserRepository,
    private memberService: MemberService,
  ) {}

  @Get('/current')
  @Roles(['admin', 'operator'])
  current(@Auth() user: User): Record<string, any> {
    return { data: `Hello ${user.first_name} ${user.last_name}` };
  }

  @Post('/login')
  @UseFilters(ValidationFilter)
  @UsePipes(new ValidationPipe(loginUserRequestValidation))
  @Header('Content-Type', 'application/json')
  @UseInterceptors(TimeInterceptor)
  login(@Query('name') name: string, @Body() request: LoginUserRequest) {
    return {
      data: `Hello ${request.username}`,
    };
  }

  @Get('/connection')
  getConnection(): string {
    this.mailService.sendMail();
    this.emailService.sendMail();

    console.info(this.memberService.getConnectionName());
    this.memberService.sendMail();

    return this.connection.getName();
  }

  @Get('/create')
  async create(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName: string,
    @Query('role') role: string,
  ): Promise<User> {
    if (!firstName) {
      throw new HttpException(
        {
          code: 400,
          error: 'first_name is requered!',
        },
        400,
      );
    }
    return this.userRepository.save(firstName, lastName, role);
  }

  @Get('/hello')
  // @UseFilters(ValidationFilter)
  async sayHello(@Query('name') name: string): Promise<string> {
    return this.services.sayHello(name);
  }

  @Get('/view/hello')
  viewHello(@Query('name') name: string, @Res() response: Response) {
    response.render('index.html', { title: 'Template Engine', name: name });
  }

  @Get('/set-cookie')
  setCookie(@Query('name') name: string, @Res() response: Response) {
    response.cookie('name', name);
    response.status(200).send('Success Set Cookie');
  }

  @Get('/get-cookie')
  getCookie(@Req() request: Request): string {
    return request.cookies['name'];
  }

  @Get('/sample-response')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  sampleResponse(): Record<string, string> {
    return {
      data: 'Hello JSON!',
    };
  }

  @Get('/redirect')
  @Redirect()
  redirect(): HttpRedirectResponse {
    return {
      url: '/api/users/sample-response',
      statusCode: 301,
    };
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number): string {
    id = id * 25;
    return `GET ${id}`;
  }

  @Post()
  post(): string {
    return 'POST';
  }

  @Get('/sample')
  get(): string {
    return 'GET';
  }
}
