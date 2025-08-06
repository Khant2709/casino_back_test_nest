import { Injectable } from '@nestjs/common';
import { executeQuery } from '@utils/dbExecuteQuery';
import { PageModel } from './pages.model';

@Injectable()
export class PagesService {
  async getCurrentPageData(casinoId: number, page: string) {
    const query = `
      SELECT content, title, meta_title, meta_description, keywords
      FROM pages
      WHERE casino_id = ? AND page = ?
    `;
    return await executeQuery<PageModel[]>(query, [casinoId, page]);
  }
}
