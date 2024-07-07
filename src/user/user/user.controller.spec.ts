import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import * as httpMock from 'node-mocks-http';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should can say Hello Nero', async () => {
    const response = await controller.sayHello('Nero');
    expect(response).toBe('Hello Nero');
  });

  it('should can view template', async () => {
    const response = httpMock.createResponse();
    controller.viewHello('Nero', response);

    expect(response._getRenderView()).toBe('index.html');
    expect(response._getRenderData()).toEqual({
      title: 'Template Engine',
      name: 'Nero',
    });
  });
});
