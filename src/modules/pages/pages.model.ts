import { RowDataPacket } from 'mysql2/promise';

export interface PageModel extends RowDataPacket {
  content: string;
  title: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
}
