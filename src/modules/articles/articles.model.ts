import {RowDataPacket} from "mysql2/promise";

export interface CountModel extends RowDataPacket {
  total: number;
}

export interface ArticleCardModel extends RowDataPacket {
  slug: string;
  title: string;
  description: string;
}

export interface ArticleModel extends RowDataPacket {
  slug: string;
  title: string;
  content: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  data_update: Date;
}