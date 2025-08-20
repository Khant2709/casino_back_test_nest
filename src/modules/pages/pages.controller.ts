import {
  Controller,
  Get,
  Param,
  Req,
  BadRequestException,
  NotFoundException,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { PagesService } from './pages.service';
import { PageModel, PageShortModel } from '@modules/pages/pages.model';
import { MakeKeyGuard } from '@middleware/global.middleware';
import { PageDto } from './page.dto';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}
  @Get('all')
  async getAllPages(@Req() req: Request): Promise<{
    data: PageShortModel[];
    status: number;
    message: string;
  }> {
    const casinoId = req.casinoId;

    if (!casinoId) throw new BadRequestException('ID казино не определено');

    const result = await this.pagesService.getAllPagesData(casinoId);
    if (result.status !== 200 || !result?.data)
      throw new NotFoundException('Данные страниц не найдены');

    return {
      data: result.data,
      status: result.status,
      message: 'Данные страниц успешно получены',
    };
  }

  @Get('current/:page')
  async getCurrentPage(
    @Param('page') page: string,
    @Req() req: Request,
  ): Promise<{
    data: PageModel;
    status: number;
    message: string;
  }> {
    const casinoId = req.casinoId;

    if (!casinoId) throw new BadRequestException('ID казино не определено');

    const result = await this.pagesService.getCurrentPageData(
      casinoId,
      `/${page}`,
    );
    if (result.status !== 200 || !result?.data?.[0])
      throw new NotFoundException('Данные страницы не найдены');

    return {
      data: result.data[0],
      status: result.status,
      message: 'Данные страницы успешно получены',
    };
  }

  @Post('create')
  @UseGuards(MakeKeyGuard)
  async createArticle(@Body() dto: PageDto, @Req() req: Request) {
    const casinoId = req.casinoId;
    if (!casinoId) throw new BadRequestException('ID казино не определено');

    const result = await this.pagesService.createPage(casinoId, dto);

    if (result.status !== 200)
      throw new BadRequestException('Страница не создалась');

    return {
      data: null,
      status: result.status,
      message: 'Страница успешно создалась',
    };
  }
}
