import { IsDateString, IsNotEmpty, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AvailableTimesDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the professional',
  })
  @IsNotEmpty()
  @IsNumberString()
  professionalId: number;

  @ApiProperty({
    example: 1,
    description: 'ID of the service',
  })
  @IsNotEmpty()
  @IsNumberString()
  serviceId: number;

  @ApiProperty({
    example: '2023-08-10',
    description: 'Date for which to retrieve available times (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
