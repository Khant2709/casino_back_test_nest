import { Controller, Get, Param, Req, BadRequestException, NotFoundException } from '@nestjs/common';
import type { Request } from 'express';

import { PagesService } from './pages.service';
import { CasinoService } from '@modules/casino/casino.service';
import { PageModel } from '@modules/pages/pages.model';


@Controller('pages')
export class PagesController {
  constructor(
    private readonly pagesService: PagesService,
    private readonly casinoService: CasinoService,
  ) {
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
    const domain = req.domain;
    if (!domain) throw new BadRequestException('Домен не определен');

    const resultCasinoId = await this.casinoService.getCasinoId(domain);
    if (resultCasinoId?.status !== 200 || !resultCasinoId?.data?.[0]?.id) throw new NotFoundException('Казино не найдено');
    const casinoId = resultCasinoId.data[0].id;

    const result = await this.pagesService.getCurrentPageData(casinoId, page);
    if (result.status !== 200 || !result?.data?.[0]) throw new NotFoundException('Данные страницы не найдены');

    return { data: result.data[0], status: result.status, message: 'Данные страницы успешно получены' };
  }
}
