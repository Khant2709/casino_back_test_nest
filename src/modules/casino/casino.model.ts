import { RowDataPacket } from 'mysql2/promise'

export interface CasinoIdModel extends RowDataPacket {
  id: number;
}