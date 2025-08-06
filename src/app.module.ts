import { Module } from '@nestjs/common';
import { PagesModule } from '@modules/pages/pages.module';
import { CasinoModule } from '@modules/casino/casino.module';
import { ArticlesModule } from '@modules/articles/articles.module';

@Module({
  imports: [PagesModule, CasinoModule, ArticlesModule],
})
export class AppModule {}
