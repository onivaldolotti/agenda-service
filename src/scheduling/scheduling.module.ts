import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulingService } from './scheduling.service';
import { Professional } from '../professional/professional.entity';
import { Service } from '../service/service.entity';
import { Scheduling } from './scheduling.entity';
import { SchedulingController } from './scheduling.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Professional, Service, Scheduling])],
  controllers: [SchedulingController],
  providers: [SchedulingService],
  exports: [SchedulingService],
})
export class SchedulingModule {}
