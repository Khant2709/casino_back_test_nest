import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { DomainMiddleware, validateParam } from '@middleware/global.middleware';
import { CasinoService } from '@modules/casino/casino.service';

@Module({
  controllers: [PagesController],
  providers: [PagesService, CasinoService],
  imports: [],
})
export class PagesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //странный момент DomainMiddleware не отрабатывал пока тут не добавили но в гварде был указан
    consumer.apply(validateParam('page')).forRoutes('pages/current/:page');
    consumer.apply(DomainMiddleware).forRoutes('pages/create');
  }
}
