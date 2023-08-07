import { Module } from '@nestjs/common';
import { ProfessionalModule } from './professional/professional.module';
import { ServiceModule } from './service/service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulingModule } from './scheduling/scheduling.module';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from './db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
    }),
    ProfessionalModule,
    ServiceModule,
    SchedulingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
