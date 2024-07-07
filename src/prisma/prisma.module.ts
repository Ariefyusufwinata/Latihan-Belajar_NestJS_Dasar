import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

// @Global() // if you want to make the module global, but just call it into app module file to implement it
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
