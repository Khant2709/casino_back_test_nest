import { RowDataPacket } from 'mysql2/promise';

export interface PageShortModel extends RowDataPacket {
  page: string;
  title: string;
}

export interface PageModel extends RowDataPacket {
  content: string;
  title: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
}
