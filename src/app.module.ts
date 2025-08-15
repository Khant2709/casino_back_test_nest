import { MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';

import { PagesModule } from '@modules/pages/pages.module';
import { CasinoModule } from '@modules/casino/casino.module';
import { ArticlesModule } from '@modules/articles/articles.module';
import { DomainMiddleware } from '@middleware/global.middleware';

@Module({
  imports: [PagesModule, CasinoModule, ArticlesModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DomainMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
