import { Injectable } from '@nestjs/common';
import { executeQuery } from '@utils/dbExecuteQuery';
import { ArticleCardModel, ArticleModel, CountModel } from '@modules/articles/articles.model';

@Injectable()
export class ArticlesService {
  async getCountArticles(casinoId: number) {
    const query = 'SELECT COUNT(*) as total FROM articles WHERE casino_id = ?';
    return await executeQuery<CountModel[]>(query, [casinoId]);
  }

  async getArticles(casinoId: number, limit?: number, offset?: number) {
    const baseQuery = `SELECT slug, title, description FROM articles WHERE casino_id = ? ORDER BY date_update DESC`;

    const paginationClause =
      limit !== undefined && offset !== undefined ? `LIMIT ${limit} OFFSET ${offset}` : '';

    const query = `${baseQuery} ${paginationClause};`;

    return await executeQuery<ArticleCardModel[]>(query, [casinoId]);
  }

  async getArticle(casinoId: number, slug: string) {
    return await executeQuery<ArticleModel[]>(
      'SELECT slug, title, content, meta_title, meta_description, keywords, date_update FROM articles WHERE casino_id = ? AND  slug = ?',
      [casinoId, slug]);
  }
}
