import {
  Controller,
  UseGuards,
  Param,
  Query,
  Body,
  Req,
  Post,
  Get,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';

import { ArticlesService } from './articles.service';
import {
  CreateArticleDto,
  GetAllArticlesDto,
} from '@modules/articles/articles.dto';
import {
  ArticleCardModel,
  ArticleModel,
} from '@modules/articles/articles.model';
import { MakeKeyGuard } from '@middleware/global.middleware';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get('all')
  async getAllArticles(
    @Query() query: GetAllArticlesDto,
    @Req() req: Request,
  ): Promise<{
    data: {
      articles: ArticleCardModel[];
      page?: number;
      limit?: number;
      totalPages?: number;
      totalItems?: number;
    };
    status: number;
    message: string;
  }> {
    const casinoId = req.casinoId;
    if (!casinoId) throw new BadRequestException('ID казино не определено');

    const page = query?.page ? Number(query.page) : undefined;
    const limit = query?.limit ? Number(query.limit) : undefined;

    if ((page && isNaN(page)) || (limit && isNaN(limit)))
      throw new BadRequestException('Неверные параметры пагинации');

    const offset =
      typeof page === 'number' && typeof limit === 'number'
        ? (page - 1) * limit
        : undefined;

    const resultArticles = await this.articlesService.getArticles(
      casinoId,
      limit,
      offset,
    );
    if (!resultArticles?.data)
      throw new NotFoundException('Данные статей не найдены');
    console.log('[ARTICLES] ====== ', resultArticles.data);

    let totalPages;
    let totalItems;

    if (page && limit) {
      const resultCountArticles =
        await this.articlesService.getCountArticles(casinoId);
      if (!resultCountArticles?.data?.[0].total)
        throw new NotFoundException('Произошла ошибка при подсчете статей');

      totalItems = resultCountArticles.data[0].total;
      totalPages = Math.ceil(resultCountArticles.data[0].total / limit);
    }

    const data = {
      articles: resultArticles.data,
      page: page,
      limit: limit,
      totalPages,
      totalItems,
    };

    return {
      data: data,
      status: 200,
      message: 'Данные статей успешно получены',
    };
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
    const casinoId = req.casinoId;
    if (!casinoId) throw new BadRequestException('ID казино не определено');

    const result = await this.articlesService.getArticle(casinoId, slug);
    if (result.status !== 200 || !result?.data?.[0])
      throw new NotFoundException('Данные статьи не найдены');

    return {
      data: result.data[0],
      status: result.status,
      message: 'Данные статьи успешно получены',
    };
  }

  @Post('create')
  @UseGuards(MakeKeyGuard)
  async createArticle(@Body() dto: CreateArticleDto, @Req() req: Request) {
    const casinoId = req.casinoId;
    if (!casinoId) throw new BadRequestException('ID казино не определено');

    const result = await this.articlesService.createArticle(casinoId, dto);

    if (result.status !== 200)
      throw new BadRequestException('Статья не создалась');

    return {
      data: null,
      status: result.status,
      message: 'Статья успешно создалась',
    };
  }
}
