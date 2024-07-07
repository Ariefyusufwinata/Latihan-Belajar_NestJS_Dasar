import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
    console.info('Create PrismaService');
  }

  onModuleInit(): any {
    console.info('Connect PrismaService');
    this.$connect();
  }

  onModuleDestroy() {
    console.info('Disconnect PrismaService');
    this.$disconnect();
  }
}
