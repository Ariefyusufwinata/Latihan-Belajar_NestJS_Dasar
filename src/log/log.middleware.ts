import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,
  ) {}

  use(req: any, res: any, next: () => void) {
    this.logger.debug(`Recive request ${req.url}`);
    next();
  }
}
