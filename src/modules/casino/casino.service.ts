import { Injectable } from '@nestjs/common';
import { executeQuery } from '@utils/dbExecuteQuery';
import { CasinoIdModel } from './casino.model';

@Injectable()
export class CasinoService {
  async getCasinoId(domain: string) {
    const redirectResult = await executeQuery<CasinoIdModel[]>(
      'SELECT id FROM casino WHERE domain_new = ? AND has_redirect = 1 LIMIT 1',
      [domain],
    );

    if (redirectResult.data && redirectResult.data.length > 0) {
      return redirectResult;
    }

    return await executeQuery<CasinoIdModel[]>(
      'SELECT id FROM casino WHERE domain = ? LIMIT 1',
      [domain],
    );
  }
}
