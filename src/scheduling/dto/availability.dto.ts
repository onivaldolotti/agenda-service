// availability.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class AvailabilityDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  professionalId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  serviceId: number;
}
