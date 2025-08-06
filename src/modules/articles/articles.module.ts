import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { validateParam } from '@middleware/global.middleware';
import { CasinoService } from '@modules/casino/casino.service';

@Module({
  imports: [CasinoService],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(validateParam('slug'))
      .forRoutes('articles/current/:slug');
  }
}
