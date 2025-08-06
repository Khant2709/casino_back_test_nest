import { Injectable } from '@nestjs/common';
import { executeQuery } from '@utils/dbExecuteQuery';
import { ArticleCardModel, ArticleModel } from '@modules/articles/articles.model';

@Injectable()
export class ArticlesService {
  async getArticles(casinoId: number, limit?: number, offset?: number) {
    const baseQuery = `SELECT slug, title, description FROM articles WHERE casino_id = ? ORDER BY data_update DESC`;

    const paginationClause =
      limit !== undefined && offset !== undefined ? `LIMIT ${limit} OFFSET ${offset}` : '';

    const query = `${baseQuery} ${paginationClause};`;

    return await executeQuery<ArticleCardModel[]>(query, [casinoId]);
  }

  async getArticle(casinoId: number, slug: string) {
    return await executeQuery<ArticleModel[]>(
      'SELECT slug, title, content, meta_title, meta_description, keywords, data_update FROM articles WHERE casino_id = ? AND  slug = ?',
      [casinoId, slug]);
  }
}
