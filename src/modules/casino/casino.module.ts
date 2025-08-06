import { Module } from '@nestjs/common';
import { CasinoService } from './casino.service';

@Module({
  // controllers: [CasinoController],
  providers: [CasinoService],
  exports: [CasinoService],
})
export class CasinoModule {}
