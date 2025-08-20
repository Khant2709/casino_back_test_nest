import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import {
  CasinoIdMiddleware,
  validateParam,
} from '@middleware/global.middleware';
import { CasinoService } from '@modules/casino/casino.service';

@Module({
  imports: [],
  controllers: [ArticlesController],
  providers: [ArticlesService, CasinoService],
})
export class ArticlesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(validateParam('slug'))
      .forRoutes('articles/current/:slug')

      .apply(CasinoIdMiddleware)
      .forRoutes({ path: 'articles/create', method: RequestMethod.POST });
  }
}
