import {
  Controller, Get, Param, Query, Req, BadRequestException, NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';

import { ArticlesService } from './articles.service';
import { CasinoService } from '@modules/casino/casino.service';
import { GetAllArticlesDto } from '@modules/articles/articles.dto';
import { ArticleCardModel, ArticleModel } from '@modules/articles/articles.model';


@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly casinoService: CasinoService,
  ) {
  }

  @Get('all')
  async getAllArticles(
    @Query() query: GetAllArticlesDto,
    @Req() req: Request,
  ): Promise<{
    data: ArticleCardModel[];
    status: number;
    message: string;
  }> {
    const domain = req.domain;
    if (!domain) throw new BadRequestException('Домен не определен');

    const page = query?.page ? Number(query.page) : undefined;
    const limit = query?.limit ? Number(query.limit) : undefined;
    if ((page && isNaN(page)) || (limit && isNaN(limit))) throw new BadRequestException('Неверные параметры пагинации');
    const offset = (typeof page === 'number' && typeof limit === 'number') ? (page - 1) * limit : undefined;

    const resultCasinoId = await this.casinoService.getCasinoId(domain);
    if (resultCasinoId?.status !== 200 || !resultCasinoId?.data?.[0]?.id) throw new NotFoundException('Казино не найдено');
    const casinoId = resultCasinoId.data[0].id;

    const result = await this.articlesService.getArticles(casinoId, limit, offset);
    if (!result?.data) throw new NotFoundException('Данные статей не найдены');

    return { data: result.data, status: result.status, message: 'Данные статей успешно получены' };
  }


  @Get('current/:slug')
  async getArticle(
    @Param('slug') slug: string,
    @Req() req: Request,
  ): Promise<{
    data: ArticleModel;
    status: number;
    message: string;
  }> {
    const domain = req.domain;
    if (!domain) throw new BadRequestException('Домен не определен');

    const resultCasinoId = await this.casinoService.getCasinoId(domain);
    if (resultCasinoId?.status !== 200 || !resultCasinoId?.data?.[0]?.id) throw new NotFoundException('Казино не найдено');
    const casinoId = resultCasinoId.data[0].id;

    const result = await this.articlesService.getArticle(casinoId, slug);
    if (result.status !== 200 || !result?.data?.[0]) throw new NotFoundException('Данные статьи не найдены');

    return { data: result.data[0], status: result.status, message: 'Данные статьи успешно получены' };
  }
}
