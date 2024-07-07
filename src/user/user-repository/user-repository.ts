import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma/prisma.service';
import { User } from '@prisma/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class UserRepository {
  constructor(
    private prismaService: PrismaService,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,
  ) {
    this.logger.debug('Create UserRepository');
  }

  async save(
    firstName: string,
    lastName?: string,
    role?: string,
  ): Promise<User> {
    this.logger.debug(
      `Create UserRepository firstName ${firstName} lastName ${lastName}, role ${role}`,
    );
    return this.prismaService.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        role: role,
      },
    });
  }
}
